import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Storevo Ecommerce",
  description: "Production-ready full-stack ecommerce app"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container-page">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
