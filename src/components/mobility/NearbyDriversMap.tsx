"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FiMapPin, FiStar, FiTrendingUp } from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  vehicleType: "cab" | "bike" | "truck";
  latitude: number;
  longitude: number;
  distance: number;
  isAvailable: boolean;
  vehicleInfo: string;
}

const createDriverMarker = (vehicleType: string) => {
  const icons: { [key: string]: string } = {
    cab: "🚕",
    bike: "🏍️",
    truck: "🚚",
  };
  
  return L.divIcon({
    html: `<div style="background-color: #3b82f6; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); font-size: 24px;">${icons[vehicleType] || "🚗"}</div>`,
    className: "driver-marker",
    iconSize: [45, 45],
    iconAnchor: [22.5, 22.5],
    popupAnchor: [0, -22.5],
  });
};

const userMarker = L.divIcon({
  html: `<div style="background-color: #ef4444; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); font-size: 20px;">👤</div>`,
  className: "user-marker",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

interface NearbyDriversMapProps {
  userLat?: number;
  userLon?: number;
}

export function NearbyDriversMap({ userLat = 28.7041, userLon = 77.1025 }: NearbyDriversMapProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const instanceIdRef = useRef(Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    // Simulate fetching nearby drivers — positions offset relative to user's real location
    const mockDrivers: Driver[] = [
      {
        id: "drv1",
        name: "Rajesh Kumar",
        rating: 4.8,
        totalRides: 324,
        vehicleType: "cab",
        latitude: userLat + 0.0054,
        longitude: userLon + 0.0035,
        distance: 1.2,
        isAvailable: true,
        vehicleInfo: "Toyota Fortuner - DL01AB1234",
      },
      {
        id: "drv2",
        name: "Priya Singh",
        rating: 4.9,
        totalRides: 512,
        vehicleType: "bike",
        latitude: userLat - 0.0021,
        longitude: userLon - 0.0045,
        distance: 0.8,
        isAvailable: true,
        vehicleInfo: "Honda Activa - DL02CD5678",
      },
      {
        id: "drv3",
        name: "Amit Patel",
        rating: 4.7,
        totalRides: 189,
        vehicleType: "truck",
        latitude: userLat + 0.0109,
        longitude: userLon + 0.0075,
        distance: 2.1,
        isAvailable: true,
        vehicleInfo: "Mahindra Bolero - DL03EF9012",
      },
      {
        id: "drv4",
        name: "Vikram Desai",
        rating: 4.6,
        totalRides: 267,
        vehicleType: "cab",
        latitude: userLat - 0.0061,
        longitude: userLon + 0.0125,
        distance: 1.5,
        isAvailable: true,
        vehicleInfo: "Maruti Swift - DL04GH3456",
      },
      {
        id: "drv5",
        name: "Neha Gupta",
        rating: 4.9,
        totalRides: 456,
        vehicleType: "bike",
        latitude: userLat + 0.0039,
        longitude: userLon - 0.0075,
        distance: 1.1,
        isAvailable: true,
        vehicleInfo: "Bajaj Pulsar - DL05IJ7890",
      },
    ];

    setDrivers(mockDrivers);
    setIsLoading(false);
  }, [userLat, userLon]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiMapPin className="w-5 h-5" />
          <h2 className="text-xl font-bold">Available Drivers Nearby</h2>
        </div>
        <p className="text-blue-100 text-sm">{drivers.length} drivers available within 2 km</p>
      </div>

      {/* Map Container */}
      <div className="h-96 w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading nearby drivers...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            key={`nearby-drivers-map-${instanceIdRef.current}`}
            center={[userLat, userLon]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Location */}
            <Marker position={[userLat, userLon]} icon={userMarker}>
              <Popup>
                <div className="text-sm font-semibold">Your Location</div>
              </Popup>
            </Marker>

            {/* Driver Markers */}
            {drivers.map((driver) => (
              <Marker
                key={driver.id}
                position={[driver.latitude, driver.longitude]}
                icon={createDriverMarker(driver.vehicleType)}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold text-gray-800 mb-2">{driver.name}</div>
                    <div className="flex items-center gap-1 mb-2">
                      <FiStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{driver.rating}</span>
                      <span className="text-xs text-gray-600">({driver.totalRides} rides)</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      <div>{driver.vehicleInfo}</div>
                      <div className="mt-1 text-blue-600 font-semibold">{driver.distance} km away</div>
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                        Available Now
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Drivers List Below Map */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div className="text-2xl">{driver.vehicleType === "cab" ? "🚕" : driver.vehicleType === "bike" ? "🏍️" : "🚚"}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{driver.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FiStar className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-semibold text-gray-700">{driver.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{driver.distance} km away</p>
                  <div className="mt-2">
                    <span className="inline-block bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
