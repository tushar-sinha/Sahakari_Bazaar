import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Orders | Sahakari Bazaar",
  description: "Manage your returns and track your orders on Sahakari Bazaar",
};

export default function ReturnsOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns & Orders</h1>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Orders</h2>
          <p className="text-gray-600 mb-4">
            Track and manage your recent orders from Sahakari Bazaar.
          </p>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📦</div>
            <p>No orders found</p>
            <p className="text-sm">Your order history will appear here</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Returns</h2>
          <p className="text-gray-600 mb-4">
            Manage your returns and refunds for items purchased on Sahakari Bazaar.
          </p>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">↩️</div>
            <p>No returns in progress</p>
            <p className="text-sm">Your return requests will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}