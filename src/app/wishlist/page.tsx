"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useCartStore } from "@/lib/cart-store";
import { FiHeart, FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const wishlist = useCartStore((state) => state.wishlist);
  const items = useCartStore((state) => state.items);
  const removeFromWishlist = useCartStore((state) => state.removeFromWishlist);
  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const isInWishlist = useCartStore((state) => state.isInWishlist);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = (product: any) => {
    if (!product.inStock) {
      toast.error("This product is out of stock");
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart!`);
  };

  const getCartItem = (productId: string) => {
    return items.find((i) => i.product.id === productId);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart size={32} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you love for later. Start shopping and add products to your wishlist!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative">
                <Link href={`/products/${product.slug}`}>
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                {/* Wishlist button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                >
                  <FiHeart size={16} className="text-red-500 fill-current" />
                </button>

                {/* Stock status */}
                {!product.inStock && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
              </div>

              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price}
                  </span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.mrp}
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {product.unit}
                </p>

                <div className="flex gap-2">
                  {!getCartItem(product.id) ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiShoppingCart size={14} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-between bg-green-50 rounded-lg px-2 py-1">
                      <button
                        onClick={() => {
                          const cartItem = getCartItem(product.id);
                          if (cartItem) {
                            if (cartItem.quantity === 1) {
                              removeItem(product.id);
                            } else {
                              updateQuantity(product.id, cartItem.quantity - 1);
                            }
                          }
                        }}
                        className="qty-btn"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="font-bold text-blue-600 text-lg min-w-[32px] text-center">
                        {getCartItem(product.id)?.quantity}
                      </span>
                      <button
                        onClick={() => {
                          const cartItem = getCartItem(product.id);
                          if (cartItem) {
                            updateQuantity(product.id, cartItem.quantity + 1);
                          }
                        }}
                        className="qty-btn"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}