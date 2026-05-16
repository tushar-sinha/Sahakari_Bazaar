import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductsPageClient } from "@/components/products/ProductsPageClient";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const categorySlug = params.category;
  const search = params.search;

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  let products;
  if (search) {
    // Use raw SQL for case-insensitive search in SQLite
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM Product p
      JOIN Category c ON p.categoryId = c.id
      WHERE LOWER(p.name) LIKE LOWER(?)
    `;
    const params: string[] = [`%${search}%`];
    
    if (categorySlug) {
      query += ` AND c.slug = ?`;
      params.push(categorySlug);
    }
    
    query += ` ORDER BY p.name ASC`;
    
    const rawResults = await prisma.$queryRawUnsafe(query, ...params);
    
    // Transform to match the expected structure
    products = (rawResults as any[]).map((p: any) => ({
      ...p,
      category: {
        name: p.category_name,
        slug: p.category_slug,
      },
    }));
  } else {
    const where: Record<string, unknown> = {};
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
    });
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-green-600">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-800 font-medium">
          {activeCategory ? activeCategory.name : "All Products"}
        </span>
      </div>

      <ProductsPageClient
        products={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
        activeCategory={categorySlug || ""}
      />
    </div>
  );
}
