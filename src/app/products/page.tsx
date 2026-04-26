import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ where: { status: "ACTIVE" }, include: { images: true }, take: 24 });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`} className="rounded border bg-white p-4">
            <p className="font-medium">{p.name}</p>
            <p>${Number(p.basePrice).toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
