import { prisma } from "@/lib/prisma";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug }, include: { products: true } });
  return <div><h1 className="text-2xl font-bold">Category: {category?.name}</h1><p>{category?.products.length || 0} products</p></div>;
}
