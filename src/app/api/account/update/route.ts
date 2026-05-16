import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      console.error("User ID not found in session:", session);
      return NextResponse.json({ success: false, error: "User ID not found" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Check if customer exists first
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: userId },
    });

    if (!existingCustomer) {
      console.error("Customer not found with ID:", userId);
      return NextResponse.json(
        { success: false, error: "Customer profile not found" },
        { status: 404 }
      );
    }

    // Update customer profile
    const updated = await prisma.customer.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        mobile: phone.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: updated.name,
        email: updated.email,
        mobile: updated.mobile,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
