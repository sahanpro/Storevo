# Storevo - Full-Stack Ecommerce (Next.js App Router)

Production-ready ecommerce platform with customer storefront and admin dashboard.

## Stack
- Next.js App Router + React + TypeScript
- Tailwind CSS + shadcn/ui patterns
- Prisma + MySQL
- Auth.js (NextAuth) with role-based auth
- Stripe Checkout + webhook verification
- PayPal capture flow + Cash on Delivery
- Zod validation + React Hook Form ready
- Zustand cart state
- Server Actions + Route Handlers

## Installation
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Prisma migrate:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed data:
   ```bash
   npx prisma db seed
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Prisma commands
```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
npx prisma db seed
```

## Stripe setup
1. Add `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`.
2. Create webhook endpoint: `POST /api/stripe/webhook`.
3. Listen for `checkout.session.completed`.
4. Stripe updates payment and order status only from webhook route.

## PayPal setup
1. Add `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`.
2. Use `/api/paypal/create-order` and `/api/paypal/capture-order` in checkout frontend.

## Email setup
Configure SMTP vars in `.env` and use `src/lib/email.ts` for transactional emails:
- welcome
- email verification
- reset password
- order/payment/shipping lifecycle
- admin new order alert

## Admin login details (seed)
- Email: `admin@storevo.com`
- Password: `Admin@12345`

## Deployment guide
- Deploy on Vercel/Node platform.
- Set all env vars in deployment provider.
- Use managed MySQL (PlanetScale/RDS/etc).
- Run migrations before deployment traffic cutover.
- Configure Stripe webhook URL for production domain.
- Configure secure cookies and NEXTAUTH_URL.

## Project flow order
1. Project scaffold & App Router
2. Prisma schema and seed
3. Auth and role protection
4. Product/catalog systems
5. Cart/wishlist
6. Checkout and transactional order creation
7. Stripe/PayPal/COD payments
8. Email events
9. Admin dashboard modules
10. Tests and docs
