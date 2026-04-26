import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { variants: true, images: true, reviews: true } });
  if (!product) notFound();
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p>From ${Number(product.basePrice).toFixed(2)}</p>
      <p>Variants: {product.variants.length}</p>
    </div>
  );
}
