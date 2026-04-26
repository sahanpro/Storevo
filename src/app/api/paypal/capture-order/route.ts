import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { orderId, paypalTransactionId, success } = await req.json();
  await prisma.payment.update({ where: { orderId }, data: { status: success ? "PAID" : "FAILED", providerTxnId: paypalTransactionId } });
  if (success) await prisma.order.update({ where: { id: orderId }, data: { status: "PROCESSING" } });
  return Response.json({ ok: true });
}
