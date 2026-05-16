import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/investors - Register a new investor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, email, address, city, state, pincode, profession, investment, notes } = body;

    if (!name || !mobile || !address || !city || !state || !pincode || !profession) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if mobile already registered
    const existing = await prisma.investor.findUnique({
      where: { mobile },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "This mobile number is already registered." },
        { status: 409 }
      );
    }

    const investor = await prisma.investor.create({
      data: {
        name,
        mobile,
        email: email || null,
        address,
        city,
        state,
        pincode,
        profession,
        investment: investment || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      investor: { id: investor.id, name: investor.name },
    });
  } catch (error) {
    console.error("Investor registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/investors - List investors (admin)
export async function GET() {
  try {
    const investors = await prisma.investor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, investors });
  } catch (error) {
    console.error("Fetch investors error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
