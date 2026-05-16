"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { FiShoppingCart, FiPlus, FiMinus, FiHeart } from "react-icons/fi";

export function ProductCard({ product }: { product: Product }) {
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToWishlist = useCartStore((s) => s.addToWishlist);
  const removeFromWishlist = useCartStore((s) => s.removeFromWishlist);
  const wishlist = useCartStore((s) => s.wishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItem = mounted ? items.find((i) => i.product.id === product.id) : null;
  const isInWishlist = wishlist.some((p) => p.id === product.id);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  return (
    <div className="product-card bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col relative">
      {/* Discount badge */}
      {discount > 0 && (
        <div className="discount-badge">{discount}% OFF</div>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-square bg-gray-50 p-4 flex items-center justify-center">
        <Link href={`/products/${product.slug}`} className="relative h-full w-full flex items-center justify-center">
          <Image
            src={product.image}
            alt={product.name}
            width={140}
            height={140}
            className="object-contain"
          />
        </Link>

        {/* Wishlist button */}
        {mounted && (
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          >
            <FiHeart
              size={16}
              className={isInWishlist ? "text-red-500 fill-current" : "text-gray-400"}
            />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <span className="text-xs text-gray-400 mb-1">{product.unit}</span>
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 flex-1">
          <Link href={`/products/${product.slug}`} className="hover:text-green-600 transition">
            {product.name}
          </Link>
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </span>
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.mrp}
            </span>
          )}
        </div>

        {/* Add to cart / Quantity */}
        {!cartItem ? (
          <button
            onClick={handleAdd}
            className="w-full py-2 px-3 bg-[var(--color-primary)] text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-[var(--color-primary-dark)] transition-colors active:scale-95"
          >
            <FiShoppingCart size={15} />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
        ) : (
          <div className="flex items-center justify-between bg-green-50 rounded-lg px-2 py-1">
            <button
              onClick={() =>
                cartItem.quantity === 1
                  ? removeItem(product.id)
                  : updateQuantity(product.id, cartItem.quantity - 1)
              }
              className="qty-btn"
            >
              <FiMinus size={14} />
            </button>
            <span className="font-bold text-[var(--color-primary)] text-lg min-w-[32px] text-center">
              {cartItem.quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
              className="qty-btn"
            >
              <FiPlus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
