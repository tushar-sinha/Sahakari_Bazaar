"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPackage, FiClock, FiCheckCircle, FiXCircle, FiTruck, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string;
    unit: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: string | null;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-800", icon: <FiClock className="w-4 h-4" /> },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-800",    icon: <FiCheckCircle className="w-4 h-4" /> },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: <FiPackage className="w-4 h-4" /> },
  shipped:    { label: "Shipped",    color: "bg-indigo-100 text-indigo-800", icon: <FiTruck className="w-4 h-4" /> },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-800",  icon: <FiCheckCircle className="w-4 h-4" /> },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-800",      icon: <FiXCircle className="w-4 h-4" /> },
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const status = STATUS_CONFIG[order.status] ?? {
    label: order.status,
    color: "bg-gray-100 text-gray-700",
    icon: <FiPackage className="w-4 h-4" />,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Order Header */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Order</p>
            <p className="font-bold text-gray-900 text-lg">#{order.orderNumber}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
              {status.icon}
              {status.label}
            </span>
            <span className="font-bold text-gray-900">₹{order.total}</span>
          </div>
        </div>

        {/* Item previews */}
        <div className="mt-3 flex flex-wrap gap-2">
          {order.items.slice(0, expanded ? order.items.length : 3).map((item) => (
            <div key={item.id} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-6 h-6 rounded object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "/images/placeholder.png"; }}
              />
              <span className="text-xs text-gray-700">
                {item.product.name} <span className="text-gray-400">×{item.quantity}</span>
              </span>
            </div>
          ))}
          {!expanded && order.items.length > 3 && (
            <span className="text-xs text-gray-400 self-center">+{order.items.length - 3} more</span>
          )}
        </div>
      </div>

      {/* Expandable detail */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <span>{expanded ? "Hide details" : "View details"}</span>
        {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="px-5 py-4 border-t border-gray-100 space-y-4">
          {/* Items breakdown */}
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.product.name}
                  <span className="text-gray-400 ml-1">({item.product.unit})</span>
                  <span className="text-gray-500 ml-2">×{item.quantity}</span>
                </span>
                <span className="text-gray-800 font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Price summary */}
          <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery fee</span>
              <span>{order.deliveryFee === 0 ? <span className="text-green-600">Free</span> : `₹${order.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-gray-900 pt-1 border-t border-gray-100">
              <span>Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          {/* Delivery address */}
          {order.address && (
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Delivered to: </span>
              {order.address}
            </div>
          )}

          {/* Actions */}
          {order.status !== "cancelled" && order.status !== "delivered" && (
            <div className="flex gap-2 pt-1">
              <Link
                href="/returns-orders"
                className="text-xs text-red-600 hover:underline"
              >
                Cancel / Return
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError("Failed to load orders.");
        }
      })
      .catch(() => setError("Could not connect to server."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            {!isLoading && !error && (
              <p className="text-sm text-gray-500 mt-0.5">
                {orders.length} {orders.length === 1 ? "order" : "orders"} found
              </p>
            )}
          </div>
          <Link
            href="/returns-orders"
            className="text-sm text-blue-600 hover:underline"
          >
            Returns &amp; Refunds →
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-24 mb-4" />
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-100 rounded-lg w-28" />
                  <div className="h-8 bg-gray-100 rounded-lg w-28" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => { setError(null); setIsLoading(true); fetch("/api/orders").then(r => r.json()).then(d => { if (d.success) setOrders(d.orders); }).finally(() => setIsLoading(false)); }}
              className="mt-3 text-sm text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="font-semibold text-gray-700 text-lg mb-1">No orders yet</p>
            <p className="text-sm text-gray-400 mb-6">Your order history will appear here after you place an order.</p>
            <Link
              href="/products"
              className="inline-block bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
