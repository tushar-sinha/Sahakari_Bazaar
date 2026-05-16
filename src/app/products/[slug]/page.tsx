import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true, store: true },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link href="/products" className="hover:text-green-600">
          Products
        </Link>
        <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">{product.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white">
          <div className="relative h-96 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6">
            <div className="text-sm text-green-700 font-semibold mb-2">
              {product.category?.name ?? "Uncategorized"}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-600 mt-3">
              Sold by {product.store?.storeName ?? "Marketplace Partner"}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
              {product.mrp > product.price && (
                <span className="text-sm text-gray-500 line-through">₹{product.mrp}</span>
              )}
              {product.mrp > product.price && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                  Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
              <p className="text-gray-600 mt-3">{product.description || "No description available yet."}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Unit</p>
                <p className="mt-1 font-semibold text-gray-900">{product.unit}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-gray-500">Stock status</p>
                <p className={`mt-1 font-semibold ${product.inStock ? "text-emerald-600" : "text-red-600"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  );
}
