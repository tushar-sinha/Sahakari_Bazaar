import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper: Haversine distance in km
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
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
}

// Generate realistic demo services scattered around any GPS location
function generateNearbyDemoStores(lat: number, lng: number) {
  const serviceTemplates = [
    { name: "City Cabs", owner: "Cab Service Pvt Ltd", type: "cab" },
    { name: "Quick Porters", owner: "Porter Logistics", type: "porter" },
    { name: "Rapid Bikes", owner: "Bike Rentals", type: "bike" },
    { name: "Auto Stand", owner: "Auto Union", type: "auto" },
    { name: "Grand Hotel", owner: "Hotel Group", type: "hotel" },
    { name: "Sahakari Kirana Store", owner: "Rajesh Patel", type: "grocery" },
    { name: "Green Fresh Mart", owner: "Anita Sharma", type: "grocery" },
    { name: "Dr. Priya Medical Clinic", owner: "Dr. Priya Singh", type: "doctor" },
    { name: "Ravi Carpenter Services", owner: "Ravi Kumar", type: "carpenter" },
    { name: "Quick Fix Plumbing", owner: "Suresh Reddy", type: "plumber" },
    { name: "Bright Spark Electricians", owner: "Amit Electricals", type: "electrician" },
    { name: "Maths Tuition Center", owner: "Mrs. Kavita", type: "teacher" },
    { name: "Auto Care Mechanics", owner: "Ganesh Motors", type: "mechanic" },
    { name: "Elegant Tailors", owner: "Fatima Boutique", type: "tailor" },
    { name: "Fresh & Clean Laundry", owner: "Clean Services", type: "laundry" },
    { name: "Spice Garden Restaurant", owner: "Chef Raj", type: "restaurant" },
    { name: "Health Plus Pharmacy", owner: "Medical Store", type: "pharmacy" },
    { name: "Daily Needs Supermarket", owner: "Vikram Singh", type: "supermarket" },
    { name: "English Learning Hub", owner: "Prof. Sharma", type: "teacher" },
    { name: "WoodCraft Furniture", owner: "Mahesh Woods", type: "carpenter" },
    { name: "Bella Beauty Parlor", owner: "Priya Salon", type: "beauty" },
    { name: "Glow Spa & Beauty", owner: "Anjali Beauty", type: "beauty" },
    { name: "FitZone Gym", owner: "Rahul Fitness", type: "gym" },
    { name: "PowerHouse Fitness Center", owner: "Vikram Gym", type: "gym" },
    { name: "Royal Restaurant", owner: "Chef Kumar", type: "restaurant" },
    { name: "Tasty Bites Cafe", owner: "Maya Foods", type: "restaurant" },
  ];

  // Scatter stores in different directions at varying distances (1-15 km)
  const offsets = [
    { dlat:  0.008, dlng:  0.012 },   // ~1.5 km NE
    { dlat: -0.015, dlng:  0.005 },   // ~1.7 km S
    { dlat:  0.025, dlng: -0.018 },   // ~3.4 km NW
    { dlat: -0.032, dlng: -0.025 },   // ~4.5 km SW
    { dlat:  0.045, dlng:  0.030 },   // ~6 km NE
    { dlat: -0.050, dlng:  0.040 },   // ~7 km SE
    { dlat:  0.065, dlng: -0.055 },   // ~9 km NW
    { dlat: -0.075, dlng: -0.060 },   // ~10 km SW
    { dlat:  0.090, dlng:  0.070 },   // ~12 km NE
    { dlat: -0.105, dlng:  0.085 },   // ~14 km SE
  ];

  const roads = [
    "Main Road", "MG Road", "Station Road", "Market Street",
    "Gandhi Nagar", "Nehru Road", "Ring Road", "Old Highway",
    "Temple Road", "Lake View Road",
  ];

  return serviceTemplates.map((tpl, i) => {
    const storeLat = lat + offsets[i].dlat;
    const storeLng = lng + offsets[i].dlng;
    return {
      id: `demo-${i + 1}`,
      storeName: tpl.name,
      ownerName: tpl.owner,
      mobile: `98765432${(10 + i).toString().padStart(2, "0")}`,
      address: `Shop ${i + 1}, ${roads[i]}`,
      city: "Nearby",
      pincode: "",
      latitude: storeLat,
      longitude: storeLng,
      category: tpl.type,
      distance: haversineDistance(lat, lng, storeLat, storeLng),
    };
  }).sort((a, b) => a.distance - b.distance);
}

// GET /api/stores?lat=18.52&lng=73.85&radius=20&search=query&category=type
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const lat = parseFloat(url.searchParams.get("lat") || "18.5204");
    const lng = parseFloat(url.searchParams.get("lng") || "73.8567");
    const radiusKm = parseFloat(url.searchParams.get("radius") || "20");
    const searchQuery = url.searchParams.get("search") || "";
    const categoryFilter = url.searchParams.get("category") || "All";

    // 1. Try our own DB first
    const stores = await prisma.storePartner.findMany({
      where: { isActive: true },
    });

    const allStores = stores
      .filter((s) => s.latitude != null && s.longitude != null)
      .map((s) => ({
        id: s.id,
        storeName: s.storeName,
        ownerName: s.ownerName,
        mobile: s.mobile,
        address: s.address,
        city: s.city,
        pincode: s.pincode,
        latitude: s.latitude!,
        longitude: s.longitude!,
        category: s.category,
        distance: haversineDistance(lat, lng, s.latitude!, s.longitude!),
      }));

    // Apply search and category filters
    let filteredStores = allStores;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredStores = filteredStores.filter(store =>
        store.storeName.toLowerCase().includes(query) ||
        store.ownerName.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query) ||
        (store.category && store.category.toLowerCase().includes(query))
      );
    }

    if (categoryFilter !== "All") {
      filteredStores = filteredStores.filter(store => {
        const storeCategory = store.category?.toLowerCase() || "";
        const filterCategory = categoryFilter.toLowerCase();

        // Map user-friendly categories to database categories
        const categoryMap: Record<string, string[]> = {
          "cabs": ["cab", "taxi", "ride"],
          "porters": ["porter", "logistics", "mover"],
          "bikes": ["bike", "bicycle", "cycle", "rental"],
          "autos": ["auto", "rickshaw", "tuk-tuk"],
          "hotels": ["hotel", "lodge", "inn", "accommodation"],
          "grocery stores": ["grocery", "supermarket", "kirana", "convenience"],
          "teachers": ["education", "tutor", "teacher"],
          "carpenters": ["carpenter", "woodwork", "furniture"],
          "plumbers": ["plumber", "plumbing"],
          "electricians": ["electrician", "electrical"],
          "doctors": ["doctor", "medical", "clinic"],
          "mechanics": ["mechanic", "automotive", "repair"],
          "tailors": ["tailor", "sewing", "clothing"],
          "laundry services": ["laundry", "dry cleaning"],
          "restaurants": ["restaurant", "food", "cafe"],
          "pharmacies": ["pharmacy", "medical store"],
          "beauty parlors": ["beauty", "salon", "spa", "parlor"],
          "gyms": ["gym", "fitness", "health club", "workout"],
        };

        const mappedCategories = categoryMap[filterCategory] || [filterCategory];
        return mappedCategories.some(cat => storeCategory.includes(cat));
      });
    }

    let nearbyStores = filteredStores
      .filter((s) => s.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    // 2. If no DB stores nearby, generate demo stores around user's location
    let source: "db" | "demo" = "db";
    if (nearbyStores.length === 0) {
      source = "demo";
      const demoStores = generateNearbyDemoStores(lat, lng);

      // Apply same filters to demo stores
      let filteredDemoStores = demoStores;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredDemoStores = filteredDemoStores.filter(store =>
          store.storeName.toLowerCase().includes(query) ||
          store.ownerName.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query) ||
          (store.category && store.category.toLowerCase().includes(query))
        );
      }

      if (categoryFilter !== "All") {
        filteredDemoStores = filteredDemoStores.filter(store => {
          const storeCategory = store.category?.toLowerCase() || "";
          const filterCategory = categoryFilter.toLowerCase();

          const categoryMap: Record<string, string[]> = {
            "grocery stores": ["grocery", "supermarket", "kirana", "convenience"],
            "teachers": ["education", "tutor", "teacher"],
            "carpenters": ["carpenter", "woodwork", "furniture"],
            "plumbers": ["plumber", "plumbing"],
            "electricians": ["electrician", "electrical"],
            "doctors": ["doctor", "medical", "clinic"],
            "mechanics": ["mechanic", "automotive", "repair"],
            "tailors": ["tailor", "sewing", "clothing"],
            "laundry services": ["laundry", "dry cleaning"],
            "restaurants": ["restaurant", "food", "cafe"],
            "pharmacies": ["pharmacy", "medical store"],
            "beauty parlors": ["beauty", "salon", "spa", "parlor"],
            "gyms": ["gym", "fitness", "health club", "workout"],
          };

          const mappedCategories = categoryMap[filterCategory] || [filterCategory];
          return mappedCategories.some(cat => storeCategory.includes(cat));
        });
      }

      nearbyStores = filteredDemoStores
        .filter((s) => s.distance <= radiusKm)
        .slice(0, 10);
    }

    return NextResponse.json({
      success: true,
      stores: nearbyStores,
      source,
      radiusKm,
      userLocation: { lat, lng },
      totalFound: nearbyStores.length,
      searchQuery: searchQuery || undefined,
      categoryFilter: categoryFilter !== "All" ? categoryFilter : undefined,
    });
  } catch (error) {
    console.error("Stores API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
