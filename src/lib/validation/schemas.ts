import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const addToCartSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(20)
});

export const checkoutSchema = z.object({
  shippingAddressId: z.string().min(1),
  shippingMethodId: z.string().min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["STRIPE", "PAYPAL", "COD"])
});
