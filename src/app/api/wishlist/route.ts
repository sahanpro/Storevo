import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const wishlist = await prisma.wishlist.findUnique({ where: { userId: session.user.id }, include: { items: { include: { product: true } } } });
  return Response.json(wishlist);
}
