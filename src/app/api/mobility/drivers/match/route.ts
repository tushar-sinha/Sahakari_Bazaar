import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/mobility/drivers/match
 * Find and match the nearest available driver
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rideId, pickupLat, pickupLon, serviceType, radius = 5 } = body;

    if (!rideId || !pickupLat || !pickupLon || !serviceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find available drivers with matching vehicle type
    const availableDrivers = await prisma.mobilityUser.findMany({
      where: {
        role: "driver",
        isVerified: true,
        isActive: true,
        vehicles: {
          some: {
            type: serviceType,
            isActive: true,
          },
        },
      },
      include: {
        vehicles: {
          where: {
            type: serviceType,
            isActive: true,
          },
        },
      },
    });

    if (availableDrivers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No drivers available in your area",
          drivers: [],
        },
        { status: 200 }
      );
    }

    // Calculate distance using Haversine formula (mock implementation)
    const calculateDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Get driver statuses and calculate distances
    const driverWithDistances = await Promise.all(
      availableDrivers.map(async (driver) => {
        // Get driver current location (mock)
        const driverLat = driver.latitude || pickupLat + (Math.random() - 0.5) * 0.05;
        const driverLon = driver.longitude || pickupLon + (Math.random() - 0.5) * 0.05;

        const distance = calculateDistance(
          pickupLat,
          pickupLon,
          driverLat,
          driverLon
        );

        // Calculate ETA (mock: 1 minute per km + 2 minutes base)
        const eta = Math.ceil(distance * 2 + 2);

        return {
          ...driver,
          distance: Number(distance.toFixed(2)),
          eta,
          currentLocation: {
            latitude: driverLat,
            longitude: driverLon,
          },
        };
      })
    );

    // Filter drivers within radius
    const nearbyDrivers = driverWithDistances.filter(
      (d) => d.distance <= radius
    );

    if (nearbyDrivers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: `No drivers within ${radius} km radius`,
          drivers: [],
        },
        { status: 200 }
      );
    }

    // Sort by rating and then by distance
    const sortedDrivers = nearbyDrivers.sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.distance - b.distance;
    });

    // Select best driver (top rated and nearest)
    const bestDriver = sortedDrivers[0];

    // Update ride with assigned driver
    const updatedRide = await prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId: bestDriver.id,
        vehicleId: bestDriver.vehicles[0].id,
        status: "accepted",
      },
    });

    // Return top 3 options (for UI to show alternatives)
    const alternativeDrivers = sortedDrivers.slice(0, 3);

    return NextResponse.json(
      {
        success: true,
        selectedDriver: {
          id: bestDriver.id,
          name: bestDriver.name,
          rating: bestDriver.rating,
          phone: bestDriver.phoneNumber,
          profileImage: bestDriver.profileImage,
          distance: bestDriver.distance,
          eta: bestDriver.eta,
          vehicle: {
            type: bestDriver.vehicles[0].type,
            make: bestDriver.vehicles[0].make,
            model: bestDriver.vehicles[0].model,
            registrationNumber: bestDriver.vehicles[0].registrationNumber,
            color: bestDriver.vehicles[0].color,
          },
        },
        alternatives: alternativeDrivers.slice(1).map((d) => ({
          id: d.id,
          name: d.name,
          rating: d.rating,
          distance: d.distance,
          eta: d.eta,
        })),
        rideId: updatedRide.id,
        rideNumber: updatedRide.rideNumber,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Driver matching error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to match driver" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mobility/drivers/available
 * Get list of available drivers (for admin/tracking)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceType = searchParams.get("serviceType");
    const radius = parseFloat(searchParams.get("radius") || "5");
    const pickupLat = parseFloat(searchParams.get("lat") || "0");
    const pickupLon = parseFloat(searchParams.get("lon") || "0");

    const where: any = {
      role: "driver",
      isVerified: true,
      isActive: true,
    };

    if (serviceType) {
      where.vehicles = {
        some: {
          type: serviceType,
          isActive: true,
        },
      };
    }

    const drivers = await prisma.mobilityUser.findMany({
      where,
      include: {
        vehicles: true,
      },
    });

    return NextResponse.json({
      success: true,
      drivers: drivers.map((d) => ({
        id: d.id,
        name: d.name,
        rating: d.rating,
        totalRides: d.totalRides,
        vehicles: d.vehicles,
      })),
      count: drivers.length,
    });
  } catch (error: any) {
    console.error("Get drivers error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}
