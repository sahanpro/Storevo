"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addToCartSchema } from "@/lib/validation/schemas";

export async function addToCart(input: { variantId: string; quantity: number }) {
  const parsed = addToCartSchema.parse(input);
  const session = await auth();

  const variant = await prisma.productVariant.findUnique({ where: { id: parsed.variantId } });
  if (!variant || variant.stock < parsed.quantity) throw new Error("Insufficient stock");

  let cart = await prisma.cart.findFirst({ where: { userId: session?.user?.id } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session?.user?.id } });
  }

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId: parsed.variantId } },
    create: { cartId: cart.id, variantId: parsed.variantId, quantity: parsed.quantity },
    update: { quantity: { increment: parsed.quantity } }
  });
}
