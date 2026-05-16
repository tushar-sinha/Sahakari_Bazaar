import Link from "next/link";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300 mt-12">
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-900 font-black text-lg">SB</span>
              </div>
              <div>
                <div className="font-bold text-white text-lg">
                  Sahakari Bazaar
                </div>
                <div className="text-xs text-blue-300">
                  Cooperative Grocery Platform
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Building India&apos;s largest cooperative-based grocery delivery network.
              Empowering local stores, serving communities — just like Amul
              revolutionized dairy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/stores"
                  className="hover:text-white transition-colors"
                >
                  Nearby Stores
                </Link>
              </li>
              <li>
                <Link
                  href="/investor-onboarding"
                  className="hover:text-white transition-colors"
                >
                  Become an Investor
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-white transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/products?category=fruits-vegetables"
                  className="hover:text-white transition-colors"
                >
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=dairy-bread-eggs"
                  className="hover:text-white transition-colors"
                >
                  Dairy, Bread & Eggs
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=atta-rice-dal"
                  className="hover:text-white transition-colors"
                >
                  Atta, Rice & Dal
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=snacks-biscuits"
                  className="hover:text-white transition-colors"
                >
                  Snacks & Biscuits
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=beverages"
                  className="hover:text-white transition-colors"
                >
                  Beverages
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FiMapPin className="mt-0.5 text-green-400 shrink-0" size={16} />
                <span>
                  Cooperative House, Market Road,
                  <br />
                  Pune - 411001, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-green-400 shrink-0" size={16} />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-green-400 shrink-0" size={16} />
                <span>hello@sahakaribazaar.in</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-green-900">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <span>
            © 2026 Sahakari Bazaar. Built on cooperative principles. All rights
            reserved.
          </span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-white cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-white cursor-pointer">
              Partner with Us
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
