import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, payment: true } });
  if (!order || order.userId !== session?.user?.id) notFound();
  return <div><h1 className="text-2xl font-bold">Order {order.invoiceNumber}</h1><p>Status: {order.status}</p></div>;
}
