import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.expires < new Date()) return Response.json({ error: "Invalid token" }, { status: 400 });
  await prisma.user.update({ where: { email: record.identifier }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  await prisma.verificationToken.delete({ where: { token } });
  return Response.json({ ok: true });
}
