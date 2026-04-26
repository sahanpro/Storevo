import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-4xl font-bold">Modern Ecommerce Platform</h1>
      <p>Built with Next.js App Router, Prisma, Auth.js, Stripe webhooks, PayPal, COD, and admin dashboard.</p>
      <Link href="/products" className="inline-flex rounded bg-blue-600 px-4 py-2 text-white">Shop Now</Link>
    </section>
  );
}
