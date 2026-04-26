import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return Response.json({ ok: true });
  const token = crypto.randomUUID();
  await prisma.verificationToken.create({ data: { identifier: email, token, expires: new Date(Date.now() + 3600_000) } });
  await sendEmail(email, "Reset Password", `<a href='${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}'>Reset</a>`);
  return Response.json({ ok: true });
}
