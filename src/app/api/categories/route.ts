import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories - List all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
