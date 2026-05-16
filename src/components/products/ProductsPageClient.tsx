"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product, Category } from "@/lib/types";
import { FiGrid, FiList } from "react-icons/fi";

interface Props {
  products: Product[];
  categories: Category[];
  activeCategory: string;
}

export function ProductsPageClient({
  products,
  categories,
  activeCategory,
}: Props) {
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sorted = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "discount":
        return (
          (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
        );
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="flex gap-6 min-w-0">
      {/* Sidebar — Categories */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-[120px]">
          <h3 className="font-bold text-gray-800 mb-3">Categories</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/products"
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  !activeCategory
                    ? "bg-green-50 text-green-700 font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Products
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-green-50 text-green-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={20}
                    height={20}
                  />
                  <span>{cat.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">
              {products.length}
            </span>{" "}
            products found
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none cursor-pointer"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="discount">Best Discount</option>
            </select>
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-400"
                }`}
              >
                <FiGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-green-50 text-green-600"
                    : "text-gray-400"
                }`}
              >
                <FiList size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile categories */}
        <div className="lg:hidden mb-4 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <Link
              href="/products"
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !activeCategory
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {sorted.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500">
              Try changing your filters or browse all categories.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 btn-primary"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                : "space-y-3"
            }
          >
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
