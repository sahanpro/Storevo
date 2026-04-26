import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-xl font-bold">Storevo</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/category/electronics">Categories</Link>
          <Link href="/search?q=headphones">Search</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/account">Account</Link>
        </nav>
      </div>
    </header>
  );
}
