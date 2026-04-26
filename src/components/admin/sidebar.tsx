import Link from "next/link";

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["Products", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Brands", "/admin/brands"],
  ["Orders", "/admin/orders"],
  ["Customers", "/admin/customers"],
  ["Coupons", "/admin/coupons"],
  ["Reviews", "/admin/reviews"],
  ["Payments", "/admin/payments"],
  ["Shipping", "/admin/shipping"]
];

export function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-white p-4">
      <h2 className="mb-4 text-lg font-semibold">Admin</h2>
      <nav className="space-y-2 text-sm">
        {links.map(([label, href]) => (
          <Link key={href} href={href} className="block rounded px-2 py-1 hover:bg-slate-100">{label}</Link>
        ))}
      </nav>
    </aside>
  );
}
