import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, address, customerName, customerMobile, subtotal, deliveryFee, total } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in order" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `SB${Date.now().toString().slice(-8)}`;

    // Try to find/create customer if mobile provided
    let customerId: string | null = null;
    if (customerMobile) {
      const customer = await prisma.customer.upsert({
        where: { mobile: customerMobile },
        update: { name: customerName || "Guest" },
        create: {
          name: customerName || "Guest",
          mobile: customerMobile,
          address: address || null,
        },
      });
      customerId = customer.id;
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        status: "pending",
        subtotal: subtotal || 0,
        deliveryFee: deliveryFee || 0,
        total: total || 0,
        address: address || null,
        items: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/orders - List orders
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        customer: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
