import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const cart = await prisma.cart.findFirst({ where: { userId: session.user.id }, include: { items: { include: { variant: { include: { product: true } } } } } });
  return Response.json(cart);
}
