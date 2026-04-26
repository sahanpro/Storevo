"use server";

import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validation/schemas";

function invoice() {
  return `INV-${Date.now()}`;
}

export async function createOrder(payload: { shippingAddressId: string; shippingMethodId: string; couponCode?: string; paymentMethod: "STRIPE" | "PAYPAL" | "COD" }) {
  const user = await auth();
  if (!user?.user?.id) throw new Error("Unauthorized");
  const input = checkoutSchema.parse(payload);

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { userId: user.user.id },
      include: { items: { include: { variant: { include: { product: true } } } } }
    });
    if (!cart || cart.items.length === 0) throw new Error("Cart empty");

    const shipping = await tx.shippingMethod.findUnique({ where: { id: input.shippingMethodId } });
    const address = await tx.address.findUnique({ where: { id: input.shippingAddressId } });
    if (!shipping || !address) throw new Error("Invalid shipping details");

    let subtotal = 0;
    for (const item of cart.items) {
      if (item.variant.stock < item.quantity) throw new Error(`Insufficient stock for ${item.variant.sku}`);
      subtotal += Number(item.variant.product.basePrice) * item.quantity;
    }

    const discount = input.couponCode
      ? Number((await tx.coupon.findUnique({ where: { code: input.couponCode } }))?.value || 0)
      : 0;
    const shippingTotal = Number(shipping.flatRate);
    const taxTotal = subtotal * 0.08;
    const grandTotal = subtotal - discount + shippingTotal + taxTotal;

    const order = await tx.order.create({
      data: {
        invoiceNumber: invoice(),
        userId: user.user.id,
        addressSnapshot: address,
        subtotal,
        discountTotal: discount,
        shippingTotal,
        taxTotal,
        grandTotal,
        shippingMethodId: shipping.id,
        status: "PENDING",
        items: {
          create: cart.items.map((i) => ({
            productId: i.variant.productId,
            variantId: i.variantId,
            name: i.variant.product.name,
            unitPrice: i.variant.product.basePrice,
            quantity: i.quantity,
            total: Number(i.variant.product.basePrice) * i.quantity
          }))
        }
      }
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        method: input.paymentMethod as PaymentMethod,
        amount: grandTotal,
        status: input.paymentMethod === "COD" ? PaymentStatus.PENDING : PaymentStatus.PENDING
      }
    });

    for (const item of cart.items) {
      await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
      await tx.stockMovement.create({ data: { variantId: item.variantId, type: "OUT", quantity: item.quantity, reason: "Order placed" } });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  });
}
