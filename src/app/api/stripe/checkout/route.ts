import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/payments/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: order.items.map((i) => ({ price_data: { currency: "usd", product_data: { name: i.name }, unit_amount: Math.round(Number(i.unitPrice) * 100) }, quantity: i.quantity })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: { orderId: order.id }
  });

  await prisma.payment.update({ where: { orderId: order.id }, data: { sessionId: checkout.id } });
  return Response.json({ url: checkout.url });
}
