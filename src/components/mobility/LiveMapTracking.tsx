"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useMobilityStore, DriverInfo } from "@/lib/mobility-store";
import { mobilitySocket, LocationBroadcaster } from "@/lib/mobility-socket";
import { FiPhone, FiMessageCircle, FiMapPin, FiX } from "react-icons/fi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

// Custom marker icons
const createCustomMarker = (color: string, icon: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 20px;">${icon}</div>`,
    className: "custom-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const riderMarker = createCustomMarker("#3b82f6", "👤");
const driverMarker = createCustomMarker("#10b981", "🚕");
const pickupMarker = createCustomMarker("#22c55e", "📍");
const dropoffMarker = createCustomMarker("#ef4444", "🚩");

interface LiveMapTrackingProps {
  onCancel?: () => void;
}

export function LiveMapTracking({ onCancel }: LiveMapTrackingProps) {
  const {
    assignedDriver,
    currentBooking,
    isLiveTracking,
    setIsLiveTracking,
    driverLocation,
    updateDriverLocation,
    riderLocation,
    updateRiderLocation,
  } = useMobilityStore();

  const mapRef = useRef(null);
  const instanceIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const [isLoading, setIsLoading] = useState(true);
  const [driverETA, setDriverETA] = useState<number | null>(null);
  const [route, setRoute] = useState<any[]>([]);
  const [rideChatOpen, setRideChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Start location tracking
  useEffect(() => {
    const broadcaster = new LocationBroadcaster();
    
    try {
      broadcaster.startTracking((coords) => {
        updateRiderLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
          heading: coords.heading ?? undefined,
          speed: coords.speed ?? undefined,
          timestamp: new Date(),
        });
      });

      setIsLiveTracking(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to start tracking:", error);
      setIsLoading(false);
    }

    return () => {
      broadcaster.stopTracking();
    };
  }, []);

  // Simulate driver location updates from socket
  useEffect(() => {
    const handleDriverLocationUpdate = (data: any) => {
      updateDriverLocation({
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        heading: data.heading,
        speed: data.speed,
        timestamp: new Date(data.timestamp),
      });

      // Calculate ETA based on mock distance
      const mockETA = Math.max(1, Math.floor(Math.random() * 15) + 2);
      setDriverETA(mockETA);
    };

    mobilitySocket.on("driver:location-update", handleDriverLocationUpdate);

    return () => {
      mobilitySocket.off("driver:location-update", handleDriverLocationUpdate);
    };
  }, []);

  // Generate mock route polyline
  useEffect(() => {
    if (
      currentBooking?.pickup &&
      currentBooking?.dropoff &&
      driverLocation
    ) {
      const route = [
        [currentBooking.pickup.latitude, currentBooking.pickup.longitude],
        [driverLocation.latitude || currentBooking.pickup.latitude, driverLocation.longitude || currentBooking.pickup.longitude],
        [currentBooking.dropoff.latitude, currentBooking.dropoff.longitude],
      ];
      setRoute(route);
    }
  }, [driverLocation, currentBooking]);

  // Handle incoming chat messages from socket
  useEffect(() => {
    const handleDriverChatMessage = (message: any) => {
      setChatMessages((prev) => [...prev, { ...message, sender: "driver" }]);
    };
    mobilitySocket.on("driver:chat-message", handleDriverChatMessage);

    return () => {
      mobilitySocket.off("driver:chat-message", handleDriverChatMessage);
    };
  }, []);

  if (!currentBooking || !assignedDriver) {
    return (
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No active ride</p>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Booking
          </button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const message = {
      text: chatInput,
      sender: "rider",
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, message]);
    mobilitySocket.emit("rider:chat-message", message);
    setChatInput("");
  };

  const handleCancelRide = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this ride? You may be charged a cancellation fee."
      )
    ) {
      toast.success("Ride cancelled");
      onCancel?.();
    }
  };

  const handleCallDriver = () => {
    toast.success(`Calling ${assignedDriver?.name}...`);
    // In production: initiate phone call
  };

  const handleEmergency = () => {
    toast.error("Emergency alert sent to support team");
    // In production: send emergency alert
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🗺️</div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const currentPickup = currentBooking.pickup;
  const currentDropoff = currentBooking.dropoff;
  const currentDriver = driverLocation || {
    latitude: currentPickup.latitude,
    longitude: currentPickup.longitude,
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col">
      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer
          key={`live-tracking-map-${instanceIdRef.current}`}
          center={[
            (currentPickup.latitude + currentDropoff.latitude) / 2,
            (currentPickup.longitude + currentDropoff.longitude) / 2,
          ]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Route Line */}
          {route.length > 0 && (
            <Polyline
              positions={route}
              color="#3b82f6"
              weight={3}
              opacity={0.7}
              dashArray="5, 5"
            />
          )}

          {/* Pickup Marker */}
          <Marker position={[currentPickup.latitude, currentPickup.longitude]} icon={pickupMarker}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Pickup Location</p>
                <p className="text-gray-600">{currentPickup.address}</p>
              </div>
            </Popup>
          </Marker>

          {/* Dropoff Marker */}
          <Marker position={[currentDropoff.latitude, currentDropoff.longitude]} icon={dropoffMarker}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">Dropoff Location</p>
                <p className="text-gray-600">{currentDropoff.address}</p>
              </div>
            </Popup>
          </Marker>

          {/* Driver Marker */}
          <Marker position={[currentDriver.latitude, currentDriver.longitude]} icon={driverMarker}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{assignedDriver?.name}</p>
                <p className="text-gray-600">{assignedDriver?.vehicle?.registrationNumber}</p>
              </div>
            </Popup>
          </Marker>

          {/* Rider Marker */}
          {riderLocation && (
            <Marker position={[riderLocation.latitude, riderLocation.longitude]} icon={riderMarker}>
              <Popup>
                <p className="text-sm font-semibold">Your Location</p>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Cancel Button */}
        <button
          onClick={handleCancelRide}
          className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-3 hover:bg-red-600 shadow-lg z-10"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Emergency Button */}
        <button
          onClick={handleEmergency}
          className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-3 hover:bg-red-700 shadow-lg z-10 animate-pulse"
        >
          🆘
        </button>
      </div>

      {/* Driver Card & Ride Info */}
      <div className="bg-white border-t border-gray-200 shadow-2xl">
        <div className="max-w-4xl mx-auto p-4">
          {/* Driver Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Driver Details */}
            <div className="col-span-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                  🚕
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{assignedDriver?.name}</h3>
                  <p className="text-sm text-gray-600">
                    ⭐ {assignedDriver?.rating} • {assignedDriver?.vehicle?.registrationNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {assignedDriver?.vehicle?.make} {assignedDriver?.vehicle?.model}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleCallDriver}
                  className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  <FiPhone className="w-4 h-4" />
                  Call
                </button>
                <button
                  onClick={() => setRideChatOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Chat
                </button>
              </div>
            </div>

            {/* Ride Details */}
            <div className="col-span-1 bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">DISTANCE</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentBooking.estimatedDistance} km
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">ESTIMATED TIME</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {driverETA ? `${driverETA} min` : currentBooking.estimatedDuration + " min"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">FARE</p>
                  <p className="text-lg font-semibold text-green-600">
                    ₹{currentBooking.estimatedFare}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-1 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">STATUS</p>
                  <p className="text-lg font-semibold text-purple-600 capitalize">
                    🟢 {currentBooking.status || "In Progress"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">DRIVER ETA AT PICKUP</p>
                  <p className="text-sm font-medium text-gray-800">
                    {driverETA ? `${driverETA} minutes away` : "Calculating..."}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">RIDE NUMBER</p>
                  <p className="text-sm font-mono bg-white px-2 py-1 rounded">
                    {currentBooking.rideNumber || "#RD000001"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Progress */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  📍
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Pickup</p>
                  <p className="text-sm text-gray-600">{currentPickup.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  🚩
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Dropoff</p>
                  <p className="text-sm text-gray-600">{currentDropoff.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Overlay */}
      {rideChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="bg-white w-full sm:w-96 rounded-t-lg sm:rounded-lg shadow-xl flex flex-col h-96 sm:h-auto max-h-96">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-lg sm:rounded-t-lg">
              <h3 className="font-semibold">Chat with {assignedDriver?.name}</h3>
              <button
                onClick={() => setRideChatOpen(false)}
                className="text-white hover:bg-blue-700 p-1 rounded"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No messages yet. Start a conversation!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.sender === "rider" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          msg.sender === "rider"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-300 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t p-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
