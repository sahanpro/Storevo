import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if ((session?.user as { role?: string })?.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const [orders, customers, lowStock] = await Promise.all([
    prisma.order.findMany({ include: { payment: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.productVariant.findMany({ where: { stock: { lt: 10 } }, include: { product: true } })
  ]);

  const totalSales = orders.reduce((sum, o) => sum + Number(o.grandTotal), 0);
  return Response.json({ totalSales, totalOrders: orders.length, totalCustomers: customers, recentOrders: orders, lowStockProducts: lowStock });
}
