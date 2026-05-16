"use client";

import React, { useState, useEffect } from "react";
import { useMobilityStore } from "@/lib/mobility-store";
import {
  FareCalculator,
  LocationBroadcaster,
  DriverMatcher,
} from "@/lib/mobility-socket";
import {
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiSearch,
  FiX,
  FiCheck,
} from "react-icons/fi";
import toast from "react-hot-toast";

interface BookingFormProps {
  onBookingSubmit?: (bookingData: any) => void;
}

export function BookingForm({ onBookingSubmit }: BookingFormProps) {
  const {
    currentBooking,
    setCurrentBooking,
    selectedServiceType,
    setSelectedServiceType,
    isSearchingDriver,
    setIsSearchingDriver,
    setAssignedDriver,
    addToHistory,
  } = useMobilityStore();

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupLat, setPickupLat] = useState(0);
  const [pickupLon, setPickupLon] = useState(0);
  const [dropoffLat, setDropoffLat] = useState(0);
  const [dropoffLon, setDropoffLon] = useState(0);

  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [estimatedDuration, setEstimatedDuration] = useState<number | null>(
    null
  );
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(
    null
  );
  const [demandLevel, setDemandLevel] = useState<string>("Normal");
  const [demandMultiplier, setDemandMultiplier] = useState<number>(1.0);

  const [loadType, setLoadType] = useState<"small" | "medium" | "large">(
    "small"
  );
  const [helperNeeded, setHelperNeeded] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");

  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
  const [showDropdownPickup, setShowDropdownPickup] = useState(false);
  const [showDropdownDropoff, setShowDropdownDropoff] = useState(false);

  // Mock location suggestions
  const mockLocations = [
    {
      address: "123 Main Street, New Delhi",
      lat: 28.7041,
      lon: 77.1025,
    },
    {
      address: "456 Market Road, Delhi",
      lat: 28.6139,
      lon: 77.2090,
    },
    {
      address: "789 Park Avenue, New Delhi",
      lat: 28.5244,
      lon: 77.1855,
    },
    {
      address: "321 Business District, Delhi",
      lat: 28.5921,
      lon: 77.204,
    },
    {
      address: "555 Airport Road, Delhi",
      lat: 28.5562,
      lon: 77.1,
    },
  ];

  // Get current location
  const useCurrentLocation = async () => {
    try {
      const broadcaster = new LocationBroadcaster();
      const coords = await broadcaster.getCurrentLocation();
      setPickupLocation("Current Location");
      setPickupLat(coords.latitude);
      setPickupLon(coords.longitude);
      setIsUsingCurrentLocation(true);
      toast.success("Location updated!");
    } catch (error) {
      toast.error("Could not get your location. Please enable location access.");
      console.error(error);
    }
  };

  // Calculate fare when locations change
  useEffect(() => {
    if (pickupLat && pickupLon && dropoffLat && dropoffLon) {
      const distance = FareCalculator.calculateDistance(
        pickupLat,
        pickupLon,
        dropoffLat,
        dropoffLon
      );
      setEstimatedDistance(Number(distance.toFixed(2)));

      // Get fare breakdown with demand pricing
      const breakdown = FareCalculator.getFareBreakdown(
        distance,
        selectedServiceType,
        0 // activeRidesCount (mock value)
      );

      setEstimatedFare(breakdown.total);
      setDemandLevel(breakdown.demandLevel);
      setDemandMultiplier(breakdown.demandMultiplier);

      const duration = FareCalculator.estimateDuration(distance);
      setEstimatedDuration(duration);
    }
  }, [pickupLat, pickupLon, dropoffLat, dropoffLon, selectedServiceType]);

  const handlePickupSelect = (location: any) => {
    setPickupLocation(location.address);
    setPickupLat(location.lat);
    setPickupLon(location.lon);
    setShowDropdownPickup(false);
    setIsUsingCurrentLocation(false);
  };

  const handleDropoffSelect = (location: any) => {
    setDropoffLocation(location.address);
    setDropoffLat(location.lat);
    setDropoffLon(location.lon);
    setShowDropdownDropoff(false);
  };

  const swapLocations = () => {
    const tempLocation = pickupLocation;
    const tempLat = pickupLat;
    const tempLon = pickupLon;

    setPickupLocation(dropoffLocation);
    setPickupLat(dropoffLat);
    setPickupLon(dropoffLon);

    setDropoffLocation(tempLocation);
    setDropoffLat(tempLat);
    setDropoffLon(tempLon);
  };

  const handleBookNow = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error("Please select both pickup and dropoff locations");
      return;
    }

    if (!estimatedFare) {
      toast.error("Could not calculate fare. Please try again.");
      return;
    }

    // Create booking object
    const booking = {
      serviceType: selectedServiceType,
      pickup: {
        address: pickupLocation,
        latitude: pickupLat,
        longitude: pickupLon,
      },
      dropoff: {
        address: dropoffLocation,
        latitude: dropoffLat,
        longitude: dropoffLon,
      },
      loadType: selectedServiceType === "truck" ? loadType : undefined,
      helperNeeded: selectedServiceType === "truck" ? helperNeeded : false,
      estimatedDistance: estimatedDistance ?? undefined,
      estimatedDuration: estimatedDuration ?? undefined,
      estimatedFare: estimatedFare ?? undefined,
      specialNotes,
      status: "requested",
    };

    setCurrentBooking(booking);
    setIsSearchingDriver(true);

    // Show searching animation
    toast.loading("Searching for nearby drivers...", { id: "driver-search" });

    // Simulate driver search
    setTimeout(async () => {
      try {
        const drivers = await DriverMatcher.findNearestDrivers(
          pickupLat,
          pickupLon,
          selectedServiceType
        );

        if (drivers.length > 0) {
          const selectedDriver = DriverMatcher.selectBestDriver(drivers);
          setAssignedDriver(selectedDriver);
          toast.success(
            `Driver assigned: ${selectedDriver.name} (⭐ ${selectedDriver.rating})`,
            { id: "driver-search" }
          );
        } else {
          toast.error("No drivers available in your area", {
            id: "driver-search",
          });
        }
      } catch (error) {
        toast.error("Failed to find drivers", { id: "driver-search" });
        console.error(error);
      }

      setIsSearchingDriver(false);
    }, 2000);

    addToHistory(booking);
    onBookingSubmit?.(booking);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      {/* Service Type Selector */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Select Service
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {["cab", "bike", "truck"].map((service) => (
            <button
              key={service}
              onClick={() => setSelectedServiceType(service as any)}
              className={`py-3 px-2 rounded-lg font-medium text-sm transition-all ${
                selectedServiceType === service
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {service === "cab"
                ? "🚕 Cab"
                : service === "bike"
                  ? "🏍️ Bike"
                  : "🚚 Truck"}
            </button>
          ))}
        </div>
      </div>

      {/* Location Input */}
      <div className="space-y-4 mb-6">
        {/* Pickup Location */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1.5 block">
            Pickup Location
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiMapPin className="w-5 h-5 text-green-600" />
            </div>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => {
                setPickupLocation(e.target.value);
                setShowDropdownPickup(true);
              }}
              onFocus={() => setShowDropdownPickup(true)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {pickupLocation && (
              <button
                onClick={() => {
                  setPickupLocation("");
                  setPickupLat(0);
                  setPickupLon(0);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="w-4 h-4 text-gray-400" />
              </button>
            )}

            {/* Pickup Dropdown */}
            {showDropdownPickup && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                <button
                  onClick={useCurrentLocation}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 font-medium hover:bg-blue-50 border-b border-gray-200 flex items-center gap-2"
                >
                  📍 Use Current Location
                </button>
                {mockLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePickupSelect(loc)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {loc.address}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button */}
        <button
          onClick={swapLocations}
          className="w-full py-2 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ⇅ Swap Locations
        </button>

        {/* Dropoff Location */}
        <div className="relative">
          <label className="text-xs font-semibold text-gray-600 uppercase mb-1.5 block">
            Dropoff Location
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiMapPin className="w-5 h-5 text-red-600" />
            </div>
            <input
              type="text"
              placeholder="Enter dropoff location"
              value={dropoffLocation}
              onChange={(e) => {
                setDropoffLocation(e.target.value);
                setShowDropdownDropoff(true);
              }}
              onFocus={() => setShowDropdownDropoff(true)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            {dropoffLocation && (
              <button
                onClick={() => {
                  setDropoffLocation("");
                  setDropoffLat(0);
                  setDropoffLon(0);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="w-4 h-4 text-gray-400" />
              </button>
            )}

            {/* Dropoff Dropdown */}
            {showDropdownDropoff && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                {mockLocations.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDropoffSelect(loc)}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {loc.address}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Truck-specific Options */}
      {selectedServiceType === "truck" && (
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="mb-3">
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Load Type
            </label>
            <select
              value={loadType}
              onChange={(e) => setLoadType(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="small">📦 Small (up to 50 kg)</option>
              <option value="medium">📦📦 Medium (50-100 kg)</option>
              <option value="large">📦📦📦 Large (100+ kg)</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={helperNeeded}
              onChange={(e) => setHelperNeeded(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Need helper assistance?</span>
          </label>
        </div>
      )}

      {/* Special Notes */}
      <div className="mb-6">
        <label className="text-sm font-semibold text-gray-700 block mb-2">
          Special Instructions (Optional)
        </label>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="Add any special notes for the driver..."
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm resize-none"
          rows={2}
        />
        <p className="text-xs text-gray-500 mt-1">{specialNotes.length}/200</p>
      </div>

      {/* Fare Estimation */}
      {estimatedFare && (
        <div className="mb-6 space-y-3">
          {/* Main Fare Card */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-300">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <FiSearch className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-600">Distance</p>
                <p className="font-semibold text-lg text-gray-800">
                  {estimatedDistance} km
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <FiClock className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-600">ETA</p>
                <p className="font-semibold text-lg text-gray-800">
                  {estimatedDuration} min
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <FiDollarSign className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-600">Fare</p>
                <p className="font-semibold text-lg text-green-600">
                  ₹{estimatedFare}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        disabled={isSearchingDriver || !estimatedFare}
        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
          isSearchingDriver || !estimatedFare
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:scale-105"
        }`}
      >
        {isSearchingDriver ? (
          <>
            <span className="animate-spin">⏳</span>
            Searching for Drivers...
          </>
        ) : (
          <>
            <FiCheck className="w-5 h-5" />
            Book Now
          </>
        )}
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-4">
        By booking, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
