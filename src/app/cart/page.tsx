"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cart-store";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from "react-icons/fi";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const deliveryFee = subtotal >= 299 ? 0 : 29;
  const total = subtotal + deliveryFee;

  const totalSavings = items.reduce(
    (sum, item) => sum + (item.product.mrp - item.product.price) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-8">
            Looks like you haven&apos;t added anything to your cart yet. Browse
            our products and find something you love!
          </p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            <FiShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800 font-medium">Shopping Cart</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Shopping Cart ({itemCount} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const discount = Math.round(
              ((item.product.mrp - item.product.price) / item.product.mrp) * 100
            );
            return (
              <div
                key={item.product.id}
                className="bg-white rounded-xl p-4 border border-gray-100 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mb-2">
                    {item.product.unit}
                  </p>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{item.product.price}
                    </span>
                    {discount > 0 && (
                      <>
                        <span className="text-sm text-gray-400 line-through">
                          ₹{item.product.mrp}
                        </span>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          item.quantity === 1
                            ? removeItem(item.product.id)
                            : updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                        }
                        className="qty-btn"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="font-bold text-lg min-w-[32px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="qty-btn"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    {/* Item total + delete */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold text-sm hover:underline mt-4"
          >
            <FiArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-[120px]">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({itemCount} items)
                </span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>

              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>You Save</span>
                  <span className="font-semibold">
                    -₹{totalSavings.toFixed(2)}
                  </span>
                </div>
              )}

              <hr className="my-3" />

              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gray-800">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            {deliveryFee > 0 && (
              <div className="mt-4 bg-yellow-50 text-yellow-700 text-xs rounded-lg p-3">
                Add ₹{(299 - subtotal).toFixed(0)} more for FREE delivery!
              </div>
            )}

            <Link
              href="/checkout"
              className="btn-primary w-full mt-6 text-center block"
            >
              Proceed to Checkout
            </Link>

            <div className="mt-4 text-xs text-gray-400 text-center">
              🔒 Secure checkout · Free returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
