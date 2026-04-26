import { stripe } from "@/lib/payments/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("No signature", { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.payment.update({ where: { orderId }, data: { status: "PAID", providerTxnId: session.payment_intent as string } });
      await prisma.order.update({ where: { id: orderId }, data: { status: "PROCESSING" } });
    }
  }

  return new Response("ok");
}
