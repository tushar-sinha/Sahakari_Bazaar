import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Sahakari Bazaar - Cooperative Grocery Delivery",
  description:
    "India's cooperative-based online grocery delivery platform. Fresh groceries delivered from local stores to your doorstep.",
  keywords: [
    "grocery delivery",
    "cooperative",
    "sahakari",
    "online grocery",
    "fresh vegetables",
    "local stores",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
