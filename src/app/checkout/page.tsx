"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import toast from "react-hot-toast";
import { FiCheckCircle, FiMapPin, FiCreditCard, FiShield } from "react-icons/fi";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const clearCart = useCartStore((s) => s.clearCart);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
  });

  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= 299 ? 0 : 29;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          address: `${form.address}, ${form.city} - ${form.pincode}`,
          customerName: form.name,
          customerMobile: form.mobile,
          subtotal,
          deliveryFee,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrderNumber(data.orderNumber);
        setOrderPlaced(true);
        clearCart();
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="text-green-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Order Placed!
          </h1>
          <p className="text-gray-500 mb-2">
            Your order has been placed successfully.
          </p>
          <div className="bg-green-50 rounded-xl p-4 mb-8 inline-block">
            <span className="text-sm text-gray-600">Order Number:</span>
            <div className="text-xl font-bold text-green-700">
              {orderNumber}
            </div>
          </div>
          <div className="space-y-3">
            <Link href="/products" className="btn-primary block">
              Continue Shopping
            </Link>
            <Link href="/" className="block text-sm text-gray-500 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Nothing to checkout
        </h1>
        <p className="text-gray-500 mb-6">
          Your cart is empty. Add some products first.
        </p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/cart" className="hover:text-green-600">Cart</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800 font-medium">Checkout</span>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <FiMapPin className="text-green-600" size={20} />
                Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={form.mobile}
                    onChange={(e) =>
                      setForm({ ...form, mobile: e.target.value })
                    }
                    className="input-field"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    required
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="input-field"
                    rows={2}
                    placeholder="House/flat no, street, area..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="input-field"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    value={form.pincode}
                    onChange={(e) =>
                      setForm({ ...form, pincode: e.target.value })
                    }
                    className="input-field"
                    placeholder="6-digit pincode"
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <FiCreditCard className="text-green-600" size={20} />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    defaultChecked
                    className="accent-green-600"
                  />
                  <span className="font-medium text-gray-800">
                    Cash on Delivery
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Pay when you receive
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    disabled
                  />
                  <span className="font-medium text-gray-800">
                    Credit/Debit Card
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Coming soon
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="netbanking"
                    disabled
                  />
                  <span className="font-medium text-gray-800">
                    Net Banking
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Coming soon
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    disabled
                  />
                  <span className="font-medium text-gray-800">
                    UPI Payment
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Coming soon
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer opacity-50">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    disabled
                  />
                  <span className="font-medium text-gray-800">
                    Digital Wallets
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Paytm, PhonePe, etc. - Coming soon
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-[120px]">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-gray-600 truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium shrink-0">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-3" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Subtotal ({getItemCount()} items)
                  </span>
                  <span className="font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </span>
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
                <hr />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>

              <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
                <FiShield size={14} />
                Secure checkout · 100% safe
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
