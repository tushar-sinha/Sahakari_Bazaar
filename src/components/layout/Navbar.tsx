"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiMapPin,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHeart,
  FiTruck,
} from "react-icons/fi";
import { useCartStore } from "@/lib/cart-store";
import { CategoryDropdown } from "./CategoryDropdown";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const [location, setLocation] = useState("Select Location");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const items = useCartStore((s) => s.items);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const wishlist = useCartStore((s) => s.wishlist);
  const router = useRouter();

  const productNames = [
    "Search for groceries, vegetables, fruits...",
    "Search for milk, bread, eggs...",
    "Search for rice, atta, dal...",
    "Search for snacks, biscuits, chocolates...",
    "Search for tea, coffee, beverages...",
    "Search for oil, ghee, spices...",
    "Search for personal care products...",
    "Search for cleaning supplies...",
  ];

  useEffect(() => {
    setMounted(true);
    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
            );
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              "Your Area";
            const pincode = data.address?.postcode || "";
            setLocation(`${city}${pincode ? " " + pincode : ""}`);
          } catch {
            setLocation("Your Location");
          }
        },
        () => setLocation("Enable Location")
      );
    }
  }, []);

  // Scrolling placeholder effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % productNames.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [productNames.length]);

  const itemCount = mounted ? getItemCount() : 0;

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const params = new URLSearchParams();
    params.set("search", searchQuery.trim());
    router.push(`/products?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-blue-900 text-white">
        <div className="w-full px-4 flex items-center h-[64px] gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight">Sahakari</div>
              <div className="text-[10px] text-blue-200 leading-tight -mt-0.5">
                Bazaar
              </div>
            </div>
          </Link>

          {/* Location */}
          <button className="hidden md:flex items-center gap-1 text-sm hover:outline hover:outline-1 hover:outline-white rounded px-2 py-1.5 shrink-0">
            <FiMapPin className="text-blue-300" size={18} />
            <div className="text-left">
              <div className="text-[10px] text-blue-200">Deliver to</div>
              <div className="font-semibold text-sm truncate max-w-[140px]">
                {location}
              </div>
            </div>
          </button>

          {/* Search bar */}
          <div className="flex-1 flex">
            <input
              type="text"
              placeholder={productNames[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 h-[42px] px-4 bg-white text-gray-800 text-sm outline-none rounded-l-lg"
            />
            <button
              onClick={handleSearch}
              className="h-[42px] px-4 bg-[#ffd814] rounded-r-lg hover:bg-[#f0c800] transition-colors"
            >
              <FiSearch className="text-gray-700" size={20} />
            </button>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-1">
            {/* Account */}
            <div className="relative group">
              <button className="flex items-center px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded text-sm">
                <span className="text-sm text-blue-200">
                  {session?.user?.name ? "Hello," : "Hello, sign in"}
                </span>
                <span className="font-semibold flex items-center gap-0.5 ml-1">
                  {session?.user?.name
                    ? `${session.user.name.charAt(0).toUpperCase()}${session.user.name.slice(1)}`
                    : "Account"}
                  <FiChevronDown size={12} />
                </span>
              </button>
              
              {/* Account dropdown */}
              <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {session?.user ? (
                  <>
                    <Link
                      href={`/profile/${session.user.id || 'me'}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-semibold border-b border-gray-200"
                    >
                      <FiUser size={16} />
                      My Profile
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Your Wishlist
                      {mounted && wishlist.length > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      href="/returns-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Returns & Orders
                    </Link>
                    <Link
                      href="/investor-onboarding"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Join our Community
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Create Account
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Your Wishlist
                    </Link>
                    <Link
                      href="/returns-orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Returns & Orders
                    </Link>
                    <Link
                      href="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/investor-onboarding"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    >
                      Join our Community
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Returns & Orders */}
            <Link
              href="/returns-orders"
              className="flex flex-col px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded text-sm"
            >
              <span className="text-[10px] text-blue-200">Returns &</span>
              <span className="font-semibold">Orders</span>
            </Link>

            {/* Mobility */}
            <Link
              href="/mobility"
              className="flex items-center gap-1 px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded"
            >
              <FiTruck size={24} className="text-yellow-300" />
              <div className="flex flex-col text-sm">
                <span className="text-[10px] text-blue-200">Quick</span>
                <span className="font-semibold leading-tight -mt-1">Mobility</span>
              </div>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-1 px-3 py-1.5 hover:outline hover:outline-1 hover:outline-white rounded relative"
            >
              <div className="relative">
                <FiShoppingCart size={26} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 badge cart-badge-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="font-semibold text-sm hidden lg:inline">Cart</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom nav bar */}
      <div className="bg-blue-800 text-white text-sm hidden md:block">
        <div className="w-full px-4 flex items-center gap-6 h-[38px] overflow-x-auto">
          <CategoryDropdown />
          <Link
            href="/products?category=fruits-vegetables"
            className="hover:underline whitespace-nowrap"
          >
            Fruits & Vegetables
          </Link>
          <Link
            href="/products?category=dairy-bread-eggs"
            className="hover:underline whitespace-nowrap"
          >
            Dairy & Eggs
          </Link>
          <Link
            href="/products?category=atta-rice-dal"
            className="hover:underline whitespace-nowrap"
          >
            Atta, Rice & Dal
          </Link>
          <Link
            href="/products?category=oil-ghee-masala"
            className="hover:underline whitespace-nowrap"
          >
            Oil & Masala
          </Link>
          <Link
            href="/products?category=snacks-biscuits"
            className="hover:underline whitespace-nowrap"
          >
            Snacks
          </Link>
          <Link
            href="/products?category=beverages"
            className="hover:underline whitespace-nowrap"
          >
            Beverages
          </Link>
          <Link
            href="/products?category=electronics-accessories"
            className="hover:underline whitespace-nowrap"
          >
            Electronics
          </Link>
          <Link
            href="/products?category=clothing-shoes-jewelry"
            className="hover:underline whitespace-nowrap"
          >
            Clothing & Fashion
          </Link>
          <Link
            href="/products?category=home-kitchen"
            className="hover:underline whitespace-nowrap"
          >
            Home & Kitchen
          </Link>
          <Link
            href="/products?category=beauty-personal-care"
            className="hover:underline whitespace-nowrap"
          >
            Beauty & Personal Care
          </Link>
          <Link
            href="/investor-onboarding"
            className="hover:underline whitespace-nowrap text-[#ffd814] font-semibold"
          >
            🤝 Join our Community
          </Link>
          <Link
            href="/stores"
            className="hover:underline whitespace-nowrap text-green-200"
          >
            📍 Nearby Services
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {/* Location */}
            <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
              <FiMapPin size={16} className="text-green-600 shrink-0" />
              <span className="truncate">{location}</span>
            </div>
            <hr className="my-1" />

            {/* Auth section */}
            {session?.user ? (
              <div className="py-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-blue-700 font-bold text-sm">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {session.user.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {session.user.email}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/profile/${session.user.id || "me"}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 text-gray-700"
                >
                  <FiUser size={16} /> My Profile
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-2.5 text-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <FiHeart size={16} /> Wishlist
                  </span>
                  {mounted && wishlist.length > 0 && (
                    <span className="badge">{wishlist.length}</span>
                  )}
                </Link>
                <Link
                  href="/returns-orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 text-gray-700"
                >
                  Returns &amp; Orders
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 py-2.5 text-gray-700"
                >
                  Account Settings
                </Link>
                <hr className="my-2" />
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="w-full text-left py-2 text-red-500 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="py-2 flex gap-3">
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 text-center bg-blue-600 text-white rounded-lg font-semibold text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-2.5 text-center border border-blue-600 text-blue-600 rounded-lg font-semibold text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <hr className="my-1" />

            <Link
              href="/mobility"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2.5 text-gray-700"
            >
              <FiTruck size={16} className="text-yellow-500" /> Quick Mobility
            </Link>
            <Link
              href="/investor-onboarding"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2.5 text-green-700 font-semibold"
            >
              Join our Community
            </Link>
            <Link
              href="/stores"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 py-2.5 text-gray-700"
            >
              Nearby Stores
            </Link>

            <hr className="my-1" />
            <div className="text-xs text-gray-400 py-1">
              Groceries · Electronics · Clothing · Home &amp; Kitchen · Beauty
            </div>
          </div>
        </div>
      )}
    </header>
  );
}