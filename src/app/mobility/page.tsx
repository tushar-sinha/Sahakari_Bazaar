"use client";

import React, { useEffect, useState } from "react";
import { useMobilityStore, MobilityBooking } from "@/lib/mobility-store";
import { BookingForm } from "@/components/mobility/BookingForm";
import dynamic from "next/dynamic";
import {
  FiMapPin,
  FiClock,
  FiStar,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";

const LiveMapTracking = dynamic(
  () => import("@/components/mobility/LiveMapTracking").then((mod) => ({ default: mod.LiveMapTracking })),
  { ssr: false }
);

const NearbyDriversMap = dynamic(
  () => import("@/components/mobility/NearbyDriversMap").then((mod) => ({ default: mod.NearbyDriversMap })),
  { ssr: false }
);

export default function MobilityPage() {
  const {
    activeTab,
    setActiveTab,
    currentBooking,
    bookingHistory,
    assignedDriver,
    isSearchingDriver,
    resetBooking,
  } = useMobilityStore();

  const [showMap, setShowMap] = useState(false);
  const [userLat, setUserLat] = useState(28.7041);
  const [userLon, setUserLon] = useState(77.1025);
  const [locationStatus, setLocationStatus] = useState<"pending" | "granted" | "denied">("pending");

  // Request real geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLon(pos.coords.longitude);
        setLocationStatus("granted");
      },
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // When driver is assigned, show map
  useEffect(() => {
    if (assignedDriver && !isSearchingDriver) {
      setShowMap(true);
    }
  }, [assignedDriver, isSearchingDriver]);

  // If driver assigned and user wants to track, show map
  if (showMap && currentBooking && assignedDriver) {
    return (
      <LiveMapTracking
        onCancel={() => {
          setShowMap(false);
          resetBooking();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4 sm:px-6 shadow-lg">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-2">🚗 Quick Mobility</h1>
          <p className="text-blue-100">Fast and reliable booking for Cabs, Bikes & Trucks</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("book")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "book"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📅 Book a Ride
          </button>
          {currentBooking && (
            <button
              onClick={() => setActiveTab("track")}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === "track"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              🗺️ Track Ride
            </button>
          )}
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "history"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            📋 History ({bookingHistory.length})
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {/* Book Tab */}
          {activeTab === "book" && (
            <div>
              {/* Nearby Drivers Map */}
              {locationStatus === "pending" ? (
                <div className="bg-white rounded-xl shadow-lg mb-8 p-8 flex flex-col items-center justify-center gap-3 text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="text-sm">Getting your location…</p>
                </div>
              ) : (
                <>
                  {locationStatus === "denied" && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
                      📍 Location access denied — showing default area. Enable location in your browser for accurate results.
                    </div>
                  )}
                  <NearbyDriversMap userLat={userLat} userLon={userLon} />
                </>
              )}

              {/* Booking Form and Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-2">
                  <BookingForm
                    onBookingSubmit={() => {
                      if (assignedDriver && !isSearchingDriver) {
                        setShowMap(true);
                      }
                    }}
                  />
                </div>

                {/* Info Cards */}
                <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">✅</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Safe & Secure</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        All drivers verified and trained. Real-time tracking for safety.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Quick Pickup</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Average wait time of 5-10 minutes in urban areas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">💰</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Transparent Pricing</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        No hidden charges. Fare calculated before booking.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Multi-Service</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Cabs, Bikes, Trucks - all in one platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Track Tab */}
          {activeTab === "track" && currentBooking && (
            <div>
              <LiveMapTracking
                onCancel={() => {
                  setShowMap(false);
                  resetBooking();
                }}
              />
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div>
              {bookingHistory.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-gray-600 text-lg">No rides yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Your ride history will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookingHistory.map((booking, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-lg font-semibold text-gray-800">
                            {booking.serviceType === "cab"
                              ? "🚕"
                              : booking.serviceType === "bike"
                                ? "🏍️"
                                : "🚚"}{" "}
                            {booking.serviceType.toUpperCase()}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              booking.createdAt || new Date()
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ₹{booking.estimatedFare}
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold mt-1">
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Route */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <FiMapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            {booking.pickup.address}
                          </p>
                        </div>
                        <div className="w-0.5 h-4 bg-gray-300 ml-2"></div>
                        <div className="flex items-start gap-2">
                          <FiMapPin className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            {booking.dropoff.address}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Distance</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {booking.estimatedDistance} km
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {booking.estimatedDuration} min
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Rating</p>
                          <p className="text-sm font-semibold text-yellow-500">
                            ⭐ 4.8
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                          📋 Receipt
                        </button>
                        <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          ⭐ Rate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-12 mt-12 border-t border-gray-200">
        <div className="w-full px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Why Choose Quick Mobility?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Accurate Pricing</h3>
              <p className="text-sm text-gray-600">
                Real-time fare calculation with no hidden charges
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-800 mb-2">Live Tracking</h3>
              <p className="text-sm text-gray-600">
                Real-time location tracking for complete transparency
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold text-gray-800 mb-2">Verified Drivers</h3>
              <p className="text-sm text-gray-600">
                Background checked and professionally trained drivers
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="font-semibold text-gray-800 mb-2">Insurance Cover</h3>
              <p className="text-sm text-gray-600">
                Full insurance coverage for all rides
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-gray-800 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-600">
                Dedicated customer support team available anytime
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="font-semibold text-gray-800 mb-2">Rewards Program</h3>
              <p className="text-sm text-gray-600">
                Earn points on every ride and redeem for discounts
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Quick Booking</h3>
              <p className="text-sm text-gray-600">
                Easy booking process with just a few taps
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="font-semibold text-gray-800 mb-2">Multi-Service</h3>
              <p className="text-sm text-gray-600">
                Cabs, Bikes, Trucks all on one platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 px-4 sm:px-6 bg-gray-50 border-t border-gray-200">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "How is the fare calculated?",
                a: "Fare is calculated dynamically based on demand: Base Fare + (Distance × Rate per km) × Demand Multiplier. Prices adjust in real-time based on availability but never go below our standard minimum rates. You'll see the estimated fare before booking.",
              },
              {
                q: "Are drivers verified?",
                a: "Yes! All our drivers undergo background checks, training, and carry valid licenses and insurance.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept cash, digital wallets, credit/debit cards, and our in-app wallet.",
              },
              {
                q: "Can I track my ride in real-time?",
                a: "Absolutely! Once your ride is assigned, you get real-time tracking with live driver location updates.",
              },
              {
                q: "What should I do in case of emergency?",
                a: "There's an emergency button in the app that alerts our support team and local authorities instantly.",
              },
              {
                q: "Do you offer cancellation?",
                a: "Yes, but cancellations within 1 minute are free. Afterwards, a small cancellation fee may apply.",
              },
            ].map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg p-4 shadow-sm cursor-pointer">
                <summary className="font-semibold text-gray-800 flex items-center gap-2">
                  <span>❓</span> {faq.q}
                </summary>
                <p className="text-gray-600 mt-3 ml-6">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
