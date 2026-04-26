import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [totalOrders, totalCustomers, lowStockProducts] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.productVariant.findMany({ where: { stock: { lt: 10 } }, include: { product: true } })
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border bg-white p-4">Total orders: {totalOrders}</div>
        <div className="rounded border bg-white p-4">Total customers: {totalCustomers}</div>
        <div className="rounded border bg-white p-4">Low stock: {lowStockProducts.length}</div>
      </div>
    </div>
  );
}
