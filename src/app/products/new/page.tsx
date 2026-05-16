import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { ProductCreateForm } from "@/components/products/ProductCreateForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await getServerSession(authConfig);
  if (!session) {
    redirect("/signin");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link href="/products" className="hover:text-green-600">
              Products
            </Link>
            <span className="mx-2">›</span>
            Add Product
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Add a New Product</h1>
          <p className="text-gray-600 mt-2">
            Publish a product to the marketplace. Once created, you can share the product page directly.
          </p>
        </div>
      </div>
      <ProductCreateForm categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
