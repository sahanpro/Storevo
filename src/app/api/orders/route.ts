import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const where = (session.user as { role?: string }).role === "ADMIN" ? {} : { userId: session.user.id };
  return Response.json(await prisma.order.findMany({ where, include: { items: true, payment: true }, orderBy: { createdAt: "desc" } }));
}
