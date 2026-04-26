import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OrderHistoryPage() {
  const session = await auth();
  const orders = session?.user?.id ? await prisma.order.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } }) : [];
  return <div><h1 className="text-2xl font-bold">Order history</h1><p>{orders.length} orders</p></div>;
}
