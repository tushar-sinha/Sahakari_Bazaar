import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/mobility/locations/track
 * Record live location update for a user during a ride
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rideId, userId, latitude, longitude, accuracy, heading, speed } = body;

    if (!rideId || !userId || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify ride exists
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

    // Create location record (limit to last 1000 per ride)
    const location = await prisma.liveLocation.create({
      data: {
        rideId,
        userId,
        latitude,
        longitude,
        accuracy: accuracy || undefined,
        heading: heading || undefined,
        speed: speed || undefined,
      },
    });

    // Cleanup old locations (keep only last 100 per ride)
    const oldLocations = await prisma.liveLocation.findMany({
      where: { rideId },
      orderBy: { timestamp: "desc" },
      skip: 100,
      select: { id: true },
    });

    if (oldLocations.length > 0) {
      await prisma.liveLocation.deleteMany({
        where: {
          id: {
            in: oldLocations.map((loc) => loc.id),
          },
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        location,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Location tracking error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to track location" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mobility/locations/ride/[rideId]
 * Get all location history for a ride
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rideId = searchParams.get("rideId");

    if (!rideId) {
      return NextResponse.json(
        { error: "rideId is required" },
        { status: 400 }
      );
    }

    const locations = await prisma.liveLocation.findMany({
      where: { rideId },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json(
      {
        success: true,
        locations,
        count: locations.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get locations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch locations" },
      { status: 500 }
    );
  }
}
