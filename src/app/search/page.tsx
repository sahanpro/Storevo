import { prisma } from "@/lib/prisma";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const products = await prisma.product.findMany({ where: { name: { contains: q } }, take: 20 });
  return <div><h1 className="text-2xl font-bold">Search: {q}</h1><p>{products.length} result(s)</p></div>;
}
