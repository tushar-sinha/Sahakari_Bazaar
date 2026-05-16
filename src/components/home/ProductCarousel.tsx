"use client";

import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/lib/types";

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
