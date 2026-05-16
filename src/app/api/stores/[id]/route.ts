import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    const { id } = await params;

    // Try fetch store by ID first
    let store = await prisma.storePartner.findUnique({
      where: { id },
      include: {
        products: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!store && session) {
      const sessionMobile = (session.user as any)?.mobile;
      const sessionEmail = session.user?.email;

      if (sessionMobile || sessionEmail) {
        store = await prisma.storePartner.findFirst({
          where: {
            OR: [
              sessionMobile ? { mobile: sessionMobile } : undefined,
              sessionEmail ? { email: sessionEmail } : undefined,
            ].filter(Boolean) as any,
          },
          include: {
            products: {
              include: { category: true },
              orderBy: { createdAt: "desc" },
            },
          },
        });
      }
    }

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authConfig);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    let store = await prisma.storePartner.findUnique({ where: { id } });
    let storeUpdateId = id;

    const sessionMobile = (session.user as any)?.mobile;
    const sessionEmail = session.user?.email;
    if (!store && (sessionMobile || sessionEmail)) {
      store = await prisma.storePartner.findFirst({
        where: {
          OR: [
            sessionMobile ? { mobile: sessionMobile } : undefined,
            sessionEmail ? { email: sessionEmail } : undefined,
          ].filter(Boolean) as any,
        },
      });
      if (store) {
        storeUpdateId = store.id;
      }
    }

    const body = await request.json();
    if (!store) {
      const phoneValue =
        body.phone?.trim() || sessionMobile || `user-${id}`;
      const emailValue = body.email?.trim() || sessionEmail || undefined;
      const businessNameValue =
        body.businessName?.trim() || `${session.user?.name ?? "My"} Service`;
      const ownerNameValue =
        body.ownerName?.trim() || session.user?.name || "Store Owner";

      // Create a new store if the signed-in user does not have one yet.
      const createdStore = await prisma.storePartner.create({
        data: {
          id,
          storeName: businessNameValue,
          ownerName: ownerNameValue,
          mobile: phoneValue,
          email: emailValue,
          address: body.location?.trim() || "",
          city: body.city?.trim() || "",
          state: body.state?.trim() || "",
          pincode: body.pincode?.trim() || "",
          category: body.serviceCategory?.trim() || body.businessType?.trim() || "grocery",
          website: body.website?.trim() || undefined,
          bio: body.bio?.trim() || undefined,
          profileImage: body.profileImage?.trim() || undefined,
        },
      });

      return NextResponse.json({ success: true, data: createdStore });
    }

    const isOwner =
      session.user?.id === id ||
      (sessionEmail && store.email && sessionEmail === store.email) ||
      (sessionMobile && store.mobile && sessionMobile === store.mobile);

    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const {
      businessName,
      ownerName,
      city,
      location,
      pincode,
      phone,
      email,
      website,
      profileImage,
      bio,
      businessType,
      serviceCategory,
      state,
    } = body;

    const updateData: any = {};
    if (businessName !== undefined) updateData.storeName = businessName?.trim();
    if (ownerName !== undefined) updateData.ownerName = ownerName?.trim();
    if (city !== undefined) updateData.city = city?.trim();
    if (location !== undefined) updateData.address = location?.trim();
    if (pincode !== undefined) updateData.pincode = pincode?.trim();
    if (phone !== undefined) updateData.mobile = phone?.trim();
    if (email !== undefined) updateData.email = email?.trim();
    if (website !== undefined) updateData.website = website?.trim();
    if (profileImage !== undefined) updateData.profileImage = profileImage?.trim();
    if (bio !== undefined) updateData.bio = bio?.trim();
    if (state !== undefined) updateData.state = state?.trim();

    if (serviceCategory) {
      updateData.category = serviceCategory.trim();
    } else if (businessType) {
      updateData.category = businessType.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    const updatedStore = await prisma.storePartner.update({
      where: { id: storeUpdateId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedStore });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}
