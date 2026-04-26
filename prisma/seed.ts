import { PrismaClient, UserRole, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@storevo.com" },
    create: { email: "admin@storevo.com", name: "Admin", role: UserRole.ADMIN, passwordHash, emailVerified: new Date() },
    update: {}
  });

  const [electronics, fashion] = await Promise.all([
    prisma.category.upsert({ where: { slug: "electronics" }, create: { name: "Electronics", slug: "electronics" }, update: {} }),
    prisma.category.upsert({ where: { slug: "fashion" }, create: { name: "Fashion", slug: "fashion" }, update: {} })
  ]);

  const brand = await prisma.brand.upsert({ where: { slug: "acme" }, create: { name: "ACME", slug: "acme" }, update: {} });

  const product = await prisma.product.upsert({
    where: { slug: "acme-wireless-headphones" },
    create: {
      name: "ACME Wireless Headphones",
      slug: "acme-wireless-headphones",
      description: "Premium wireless headphones",
      status: ProductStatus.ACTIVE,
      basePrice: 99.99,
      featured: true,
      bestSeller: true,
      newArrival: true,
      categoryId: electronics.id,
      brandId: brand.id,
      images: { create: [{ url: "https://picsum.photos/800", alt: "Headphones" }] },
      variants: { create: [{ sku: "ACME-WH-BLK", color: "Black", material: "ABS", stock: 50, priceDiff: 0 }] }
    },
    update: {}
  });

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    create: { code: "WELCOME10", type: "PERCENT", value: 10, minCartAmount: 50, usageLimit: 100 },
    update: {}
  });

  await prisma.shippingMethod.createMany({
    data: [
      { name: "Standard", zone: "US", flatRate: 7.99, freeShippingAbove: 100, estimatedDays: 5, isActive: true },
      { name: "Express", zone: "US", flatRate: 14.99, estimatedDays: 2, isActive: true }
    ],
    skipDuplicates: true
  });

  console.log({ admin: admin.email, product: product.slug, categories: [electronics.slug, fashion.slug] });
}

main().finally(() => prisma.$disconnect());
