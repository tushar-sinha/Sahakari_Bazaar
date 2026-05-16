"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FiMapPin,
  FiPhone,
  FiNavigation,
  FiLoader,
  FiSearch,
} from "react-icons/fi";
import dynamic from "next/dynamic";
import type { NearbyStore } from "@/lib/types";

const StoreMap = dynamic(() => import("@/components/stores/StoreMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[560px] bg-gray-50 rounded-2xl flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <FiLoader className="animate-spin text-green-500" size={36} />
        <span className="text-sm text-gray-400">Loading map…</span>
      </div>
    </div>
  ),
});

export default function StoresPage() {
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [source, setSource] = useState<"db" | "demo">("db");
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("All");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const serviceSuggestions = [
    "Search for grocery stores, restaurants, doctors...",
    "Search for teachers, carpenters, plumbers...",
    "Search for electricians, mechanics, tailors...",
    "Search for beauty parlors, gyms, laundry services...",
    "Search for pharmacies, medical clinics...",
    "Search for fitness centers, spas, salons...",
    "Search for home services, repairs, maintenance...",
    "Search for food delivery, cafes, dining...",
  ];

  const serviceCategories = [
    "All",
    "Hotels",
    "Grocery Stores",
    "Restaurants",
    "Doctors",
    "Pharmacies",
    "Teachers",
    "Carpenters",
    "Plumbers",
    "Electricians",
    "Mechanics",
    "Tailors",
    "Laundry Services",
    "Beauty Parlors",
    "Gyms",
  ];

  const fetchStores = useCallback(
    async (lat: number, lng: number, query: string = "", category: string = "All") => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lng: lng.toString(),
          radius: "10",
        });
        if (query) params.set("search", query);
        if (category !== "All") params.set("category", category);

        const res = await fetch(`/api/stores?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setStores(data.stores);
          setSource(data.source || "db");
        }
      } catch {
        setError("Failed to load nearby services.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = () => {
    if (userLat && userLng) {
      fetchStores(userLat, userLng, searchQuery, serviceCategory);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLat(lat);
          setUserLng(lng);
          await fetchStores(lat, lng);
        },
        async () => {
          setUserLat(18.5204);
          setUserLng(73.8567);
          setError("Location access denied. Showing stores near Pune.");
          await fetchStores(18.5204, 73.8567);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLat(18.5204);
      setUserLng(73.8567);
      setError("Geolocation not supported. Showing stores near Pune.");
      fetchStores(18.5204, 73.8567);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scrolling service suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % serviceSuggestions.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [serviceSuggestions.length]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📍</span> Nearby Services
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Find local services and businesses near you. Search for grocery stores, teachers, carpenters, and more.
        </p>

        {/* Search Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="flex-1 flex">
            <select
              value={serviceCategory}
              onChange={(e) => setServiceCategory(e.target.value)}
              className="h-[38px] w-[150px] px-2 bg-gray-100 text-gray-700 text-sm rounded-l-lg border-r border-gray-300 outline-none cursor-pointer"
              style={{ maxHeight: '180px', minWidth: '110px', overflowY: 'auto' }}
            >
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder={serviceSuggestions[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 h-[42px] px-4 bg-white text-gray-800 text-sm outline-none rounded-none border-x border-gray-300"
            />
            <button
              onClick={handleSearch}
              className="h-[42px] px-4 bg-[#ffd814] rounded-r-lg hover:bg-[#f0c800] transition-colors"
            >
              <FiSearch className="text-gray-700" size={20} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-3 inline-block bg-yellow-50 text-yellow-700 text-sm px-4 py-2 rounded-lg border border-yellow-200">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* ── MAP (full width, prominent) ──────────────────────────────── */}
      <div className="mb-8">
        {userLat !== null && userLng !== null && !loading ? (
          <StoreMap
            stores={stores}
            userLat={userLat}
            userLng={userLng}
            radiusKm={10}
            selectedStoreId={selectedStoreId}
            onStoreSelect={(id) => setSelectedStoreId(id)}
          />
        ) : (
          <div className="w-full h-[560px] bg-gray-50 rounded-2xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="animate-spin text-green-500" size={36} />
              <span className="text-sm text-gray-400">
                Detecting your location & finding stores…
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Section heading ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {loading
            ? "Finding services…"
            : `${stores.length} nearest service${stores.length !== 1 ? "s" : ""} within 10 km`}
        </h2>
        {source === "demo" && !loading && stores.length > 0 && (
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2.5 py-1 rounded-full">
            Demo services near your location
          </span>
        )}
      </div>

      {/* ── Store cards grid ─────────────────────────────────────────── */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-gray-100"
            >
              <div className="skeleton h-5 w-48 rounded mb-3" />
              <div className="skeleton h-4 w-36 rounded mb-2" />
              <div className="skeleton h-4 w-64 rounded" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
          <div className="text-5xl mb-4">🏪</div>
          <h3 className="font-semibold text-gray-700 text-lg mb-2">
            No services found nearby
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            We&apos;re expanding our service network! Check back soon or{" "}
            <a
              href="/investor-onboarding"
              className="text-green-600 underline font-medium"
            >
              partner with us
            </a>{" "}
            to bring more services to your area.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={`bg-white rounded-xl p-5 border cursor-pointer transition-all group ${
                  selectedStoreId === store.id
                    ? "border-green-400 shadow-md ring-2 ring-green-100"
                    : "border-gray-100 hover:border-green-200 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 text-base truncate group-hover:text-green-700 transition-colors">
                      {store.storeName}
                    </h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {store.category || "Service Provider"}
                    </p>
                  </div>
                  <span className="shrink-0 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {store.distance.toFixed(1)} km
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2 text-sm text-gray-500">
                  <FiMapPin
                    className="mt-0.5 text-gray-300 shrink-0"
                    size={14}
                  />
                  <span className="line-clamp-2">
                    {store.address}, {store.city}{" "}
                    {store.pincode && `– ${store.pincode}`}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/profile/${store.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    👤 Profile
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-2 py-2 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FiNavigation size={12} />
                    Directions
                  </a>
                  {store.mobile && (
                    <a
                      href={`tel:${store.mobile}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs font-semibold bg-gray-50 text-gray-600 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FiPhone size={12} />
                      {store.mobile}
                    </a>
                  )}
                </div>
              </div>
          ))}
        </div>
      )}
    </div>
  );
}
