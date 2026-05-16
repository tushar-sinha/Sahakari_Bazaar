import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/mobility/reviews
 * Create a review for a completed ride
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rideId, reviewerId, rating, comment, categories } = body;

    if (!rideId || !reviewerId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Verify ride exists and is completed
    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      return NextResponse.json(
        { error: "Ride not found" },
        { status: 404 }
      );
    }

    if (ride.status !== "completed") {
      return NextResponse.json(
        { error: "Can only review completed rides" },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.rideReview.findUnique({
      where: { rideId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Ride already reviewed" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.rideReview.create({
      data: {
        rideId,
        reviewerId,
        rating,
        comment: comment || undefined,
        categories: categories ? JSON.stringify(categories) : "{}",
      },
    });

    // Update driver rating (recalculate average)
    if (ride.driverId) {
      const driverReviews = await prisma.rideReview.findMany({
        where: {
          ride: {
            driverId: ride.driverId,
          },
        },
        select: { rating: true },
      });

      if (driverReviews.length > 0) {
        const averageRating =
          driverReviews.reduce((sum, r) => sum + r.rating, 0) /
          driverReviews.length;

        await prisma.mobilityUser.update({
          where: { id: ride.driverId },
          data: {
            rating: Math.round(averageRating * 10) / 10,
            totalRides: {
              increment: 1,
            },
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        review,
        message: "Review submitted successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create review" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/mobility/reviews/ride/[rideId]
 * Get review for a ride
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rideId = searchParams.get("rideId");
    const driverId = searchParams.get("driverId");

    let where: any = {};

    if (rideId) {
      where.rideId = rideId;
    } else if (driverId) {
      where.ride = {
        driverId,
      };
    } else {
      return NextResponse.json(
        { error: "rideId or driverId is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.rideReview.findMany({
      where,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        reviews,
        count: reviews.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
