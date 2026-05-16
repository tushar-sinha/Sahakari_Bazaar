import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/mobility/rides/[rideId]/status
 * Update ride status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { rideId: string } }
) {
  try {
    const { rideId } = params;
    const body = await req.json();
    const { status, cancelReason } = body;

    if (!rideId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const validStatuses = ["requested", "accepted", "started", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const updateData: any = { status };

    if (status === "started") {
      updateData.startedAt = new Date();
    } else if (status === "completed") {
      updateData.completedAt = new Date();
    } else if (status === "cancelled") {
      updateData.cancelledAt = new Date();
      updateData.cancelReason = cancelReason || "User cancelled";
    }

    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: updateData,
      include: {
        driver: true,
        vehicle: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        ride,
        message: `Ride status updated to ${status}`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update ride status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update ride status" },
      { status: 500 }
    );
  }
}
