"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import type { BusinessProfile, Product, PortfolioItem } from "@/lib/profile-types";

interface BusinessSectionProps {
  profile: BusinessProfile;
  isOwner?: boolean;
}

export default function BusinessSection({ profile, isOwner = false }: BusinessSectionProps) {
  const [cartItems, setCartItems] = useState<Map<string, number>>(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRetailer = profile.businessType === "Retailer" || profile.businessType === "Creator";
  const isServiceProvider = profile.businessType === "Service";

  const getRecipeTip = (name: string, category: string) => {
    if (/spinach/i.test(name)) return "Perfect for salads.";
    if (/milk/i.test(name)) return "Creamy chai and porridge ready.";
    if (/cheese|paneer|dairy/i.test(category)) return "Great in warm recipes.";
    return "A fresh staple for every kitchen.";
  };

  const hasFreshBadge = (name: string, category: string) =>
    /milk|spinach|dairy|organic/i.test(`${name} ${category}`);

  const handleAddToCart = (productId: string, productName: string) => {
    const newCart = new Map(cartItems);
    const current = newCart.get(productId) || 0;
    newCart.set(productId, current + 1);
    setCartItems(newCart);
    toast.success(`${productName} added to cart!`);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = new Map(cartItems);
    const current = newCart.get(productId) || 0;
    if (current > 1) {
      newCart.set(productId, current - 1);
    } else {
      newCart.delete(productId);
    }
    setCartItems(newCart);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-3xl">
              {isServiceProvider ? "🎨" : "🛍️"}
            </span>
            {isServiceProvider ? "Portfolio" : "Featured Products"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {isServiceProvider
              ? "Showcasing our latest work and projects"
              : "Browse our collection of products"}
          </p>
        </div>
        {isOwner && !isServiceProvider ? (
          <Link
            href="/products/new"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Add Product
          </Link>
        ) : null}
      </div>

      {/* Products Section */}
      {isRetailer && profile.products && profile.products.length > 0 && (
        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {profile.products.map((product) => {
              const recipeTip = getRecipeTip(product.name, product.category);
              const showFreshBadge = hasFreshBadge(product.name, product.category);
              const isSpinach = /spinach/i.test(product.name);
              const isMilk = /milk/i.test(product.name);

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-3xl border border-[#B2AC88]/40 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="relative w-full h-40 overflow-hidden">
                    {showFreshBadge && (
                      <span className="absolute right-3 top-3 z-10 rounded-full bg-[#2D5A27] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white shadow">
                        Freshness
                      </span>
                    )}

                    {isSpinach ? (
                      <div className="relative h-full w-full bg-gradient-to-br from-[#d4e5bc] via-[#e9f1d7] to-[#f8f3e5] p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_35%)]" />
                        <div className="relative flex h-full flex-col justify-end">
                          <p className="text-lg font-bold text-[#2D5A27]">Organic Spinach</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#4a5f47]">Farm fresh greens</p>
                        </div>
                      </div>
                    ) : isMilk ? (
                      <div className="relative h-full w-full bg-gradient-to-br from-[#fff8e0] via-[#f7ebc9] to-[#ede0a6] p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.65),transparent_35%)]" />
                        <div className="relative flex h-full flex-col justify-end">
                          <p className="text-lg font-bold text-[#2D5A27]">Cow Milk</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-[#4a5f47]">Creamy organic dairy</p>
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}

                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">Out of Stock</span>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-end justify-center bg-black/0 p-4 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <div className="rounded-3xl bg-black/80 px-3 py-2 text-center text-xs text-white backdrop-blur-sm">
                        <p className="font-semibold">Quick Recipe Tip</p>
                        <p>{recipeTip}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2D5A27] mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-semibold text-[#2D5A27] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-[#4a5f47] mb-3 line-clamp-2">
                      {product.description || "Farm-fresh product ready for your kitchen."}
                    </p>

                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <span className="text-lg font-bold text-[#2D5A27]">₹{product.price}</span>
                      {product.mrp > product.price && (
                        <>
                          <span className="text-sm text-[#7a7a6d] line-through">₹{product.mrp}</span>
                          <span className="rounded-full bg-[#E9F1DA] px-2 py-1 text-[11px] font-semibold uppercase text-[#2D5A27]">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    {mounted && (
                      <div className="flex gap-2">
                        {cartItems.has(product.id) ? (
                          <div className="flex-1 flex items-center justify-between rounded-2xl border border-[#B2AC88]/40 bg-[#F4F0E5] px-2 py-1">
                            <button
                              onClick={() => handleRemoveFromCart(product.id)}
                              className="p-2 text-[#2D5A27] hover:text-[#234a24]"
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="font-semibold text-[#2D5A27]">
                              {cartItems.get(product.id)}
                            </span>
                            <button
                              onClick={() => handleAddToCart(product.id, product.name)}
                              className="p-2 text-[#2D5A27] hover:text-[#234a24]"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(product.id, product.name)}
                            disabled={!product.inStock}
                            className="flex-1 rounded-2xl bg-[#2D5A27] px-3 py-2 text-sm font-semibold text-white hover:bg-[#234a24] disabled:bg-[#b8b49f] disabled:text-[#6f6f5f] transition"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <FiShoppingCart size={16} />
                              Add
                            </div>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Portfolio Section */}
      {isServiceProvider && profile.portfolio && profile.portfolio.length > 0 && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {profile.portfolio.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group"
              >
                {/* Portfolio Image */}
                <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition">
                      View Details
                    </button>
                  </div>
                </div>

                {/* Portfolio Info */}
                <div className="p-4">
                  <p className="text-xs text-blue-600 font-semibold mb-1">
                    {item.category}
                  </p>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!isRetailer && !profile.portfolio) || (!isRetailer && profile.portfolio?.length === 0) ? (
        <div className="p-12 text-center">
          <p className="text-gray-600">No portfolio items available yet.</p>
        </div>
      ) : null}

      {(isRetailer && !profile.products) || (isRetailer && profile.products?.length === 0) ? (
        <div className="p-12 text-center">
          <p className="text-gray-600">No products available yet.</p>
        </div>
      ) : null}
    </div>
  );
}
