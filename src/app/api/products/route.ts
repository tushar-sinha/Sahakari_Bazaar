import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";

// GET /api/products - List all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      mrp,
      unit,
      image,
      categoryId,
      inStock,
    } = body;

    if (!name || !image || !categoryId) {
      return NextResponse.json(
        { error: "Name, image, and category are required." },
        { status: 400 }
      );
    }

    const slugBase = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    let slug = slugBase || `product-${Date.now()}`;

    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    });

    if (existingProduct) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const store = await prisma.storePartner.findUnique({
      where: { id: session.user.id },
    });

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        price: Number(price) || 0,
        mrp: Number(mrp) || 0,
        unit: unit?.trim() || "1 kg",
        image: image.trim(),
        inStock: Boolean(inStock),
        categoryId,
        storeId: store?.id,
      },
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error) {
    console.error("Products API create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product." },
      { status: 500 }
    );
  }
}
