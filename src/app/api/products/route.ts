import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 12;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE", name: { contains: q } },
      include: { images: true, variants: true, brand: true, category: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    }),
    prisma.product.count({ where: { status: "ACTIVE", name: { contains: q } } })
  ]);

  return Response.json({ items, total, page, pageSize });
}
