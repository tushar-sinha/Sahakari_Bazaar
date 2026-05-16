"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { FiHome, FiGrid, FiShoppingCart, FiUser } from "react-icons/fi";
import { useCartStore } from "@/lib/cart-store";

const NAV_ITEMS = [
  { href: "/", icon: FiHome, label: "Home" },
  { href: "/products", icon: FiGrid, label: "Shop" },
  { href: "/cart", icon: FiShoppingCart, label: "Cart" },
  { href: "/account", icon: FiUser, label: "Account" },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const getItemCount = useCartStore((s) => s.getItemCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-4 h-16">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname?.startsWith(href);
          const badge = label === "Cart" && cartCount > 0 ? cartCount : 0;

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? "text-blue-600" : "text-gray-500 active:text-blue-500"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-2 right-2 h-[3px] bg-blue-600 rounded-b-full" />
              )}
              <div className="relative">
                <Icon size={22} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-3 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
