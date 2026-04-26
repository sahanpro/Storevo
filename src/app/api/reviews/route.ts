import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { productId, rating, text } = await req.json();
  const purchased = await prisma.orderItem.findFirst({ where: { productId, order: { userId: session.user.id } } });
  if (!purchased) return Response.json({ error: "Purchase required" }, { status: 400 });
  return Response.json(await prisma.review.create({ data: { userId: session.user.id, productId, rating, text } }));
}
