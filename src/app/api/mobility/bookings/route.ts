import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/mobility/bookings
 * Create a new ride booking
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      riderId,
      serviceType,
      pickupLat,
      pickupLon,
      pickupAddress,
      dropoffLat,
      dropoffLon,
      dropoffAddress,
      estimatedDistance,
      estimatedDuration,
      estimatedFare,
      loadType,
      helperNeeded,
      specialNotes,
      paymentMethod,
    } = body;

    // Validation
    if (
      !riderId ||
      !serviceType ||
      !pickupLat ||
      !pickupLon ||
      !dropoffLat ||
      !dropoffLon
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique ride number
    const rideNumber = `RD${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Calculate fare with tax
    const tax = Math.round(estimatedFare * 0.05); // 5% tax
    const totalFare = estimatedFare + tax;

    // Create ride in database
    const ride = await prisma.ride.create({
      data: {
        rideNumber,
        riderId,
        serviceType,
        pickupLat,
        pickupLon,
        pickupAddress,
        dropoffLat,
        dropoffLon,
        dropoffAddress,
        estimatedDistance,
        estimatedDuration,
        baseFare: Math.round(estimatedFare * 0.4), // Base is ~40% of fare
        distanceRate: Math.round(estimatedFare * 0.6) / estimatedDistance, // Rate per km
        estimatedFare,
        tax,
        totalFare,
        loadType: serviceType === "truck" ? loadType : undefined,
        helperNeeded: serviceType === "truck" ? helperNeeded : false,
        specialNotes,
        paymentMethod: paymentMethod || "cash",
        status: "requested",
      },
    });

    return NextResponse.json(
      {
        success: true,
        ride,
        message: "Ride booked successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create booking" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mobility/bookings
 * Get all bookings for a user
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const riderId = searchParams.get("riderId");
    const status = searchParams.get("status");

    if (!riderId) {
      return NextResponse.json(
        { error: "riderId is required" },
        { status: 400 }
      );
    }

    const where: any = {
      riderId,
    };

    if (status) {
      where.status = status;
    }

    const rides = await prisma.ride.findMany({
      where,
      include: {
        driver: true,
        vehicle: true,
        review: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      rides,
      count: rides.length,
    });
  } catch (error: any) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
