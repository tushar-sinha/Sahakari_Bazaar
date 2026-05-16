"use client";

import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { NearbyStore } from "@/lib/types";

interface Props {
  stores: NearbyStore[];
  userLat: number;
  userLng: number;
  radiusKm: number;
  selectedStoreId?: string | null;
  onStoreSelect?: (storeId: string) => void;
}

export default function StoreMap({
  stores,
  userLat,
  userLng,
  radiusKm,
  selectedStoreId,
  onStoreSelect,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const circleRef = useRef<L.Circle | null>(null);
  const onStoreSelectRef = useRef(onStoreSelect);
  onStoreSelectRef.current = onStoreSelect;

  // fly to a store when selectedStoreId changes
  const flyToStore = useCallback((storeId: string) => {
    const marker = markersRef.current[storeId];
    if (marker && mapInstance.current) {
      mapInstance.current.flyTo(marker.getLatLng(), 15, { duration: 0.8 });
      marker.openPopup();
    }
  }, []);

  useEffect(() => {
    if (selectedStoreId) flyToStore(selectedStoreId);
  }, [selectedStoreId, flyToStore]);

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Ensure a single persistent container node for Leaflet
    let container = wrapperRef.current.querySelector(
      ".leaflet-map-container"
    ) as HTMLDivElement | null;
    if (!container) {
      wrapperRef.current.innerHTML = "";
      container = document.createElement("div");
      container.className = "leaflet-map-container";
      container.style.height = "100%";
      container.style.width = "100%";
      wrapperRef.current.appendChild(container);
    }

    // Initialize map only once
    if (!mapInstance.current) {
      mapInstance.current = L.map(container, {
        zoomControl: false,
        zoomAnimation: false,
        fadeAnimation: false,
        markerZoomAnimation: false,
      }).setView([userLat, userLng], 12);

      L.control.zoom({ position: "topright" }).addTo(mapInstance.current);

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(mapInstance.current);

      // Add pulse animation style once
      if (!document.getElementById("map-pulse-css")) {
        const style = document.createElement("style");
        style.id = "map-pulse-css";
        style.textContent = `@keyframes mapPulse{0%{transform:scale(.5);opacity:1}100%{transform:scale(1.6);opacity:0}}.map-pulse-ring{animation:mapPulse 2s ease-out infinite}`;
        document.head.appendChild(style);
      }
    }

    const map = mapInstance.current as L.Map;

    // Clear previous markers and circle
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    // Add radius circle
    const circle = L.circle([userLat, userLng], {
      radius: radiusKm * 1000,
      color: "#0a8f08",
      weight: 2,
      opacity: 0.55,
      fillColor: "#0a8f08",
      fillOpacity: 0.05,
      dashArray: "8, 6",
    }).addTo(map);
    circleRef.current = circle;

    // Label on the north edge of the circle (removed)

    // User location marker
    const userIcon = L.divIcon({
      html: `
        <div style="position:relative;width:44px;height:44px">
          <div style="position:absolute;top:10px;left:10px;width:24px;height:24px;border-radius:50%;background:#3b82f6;border:4px solid #fff;box-shadow:0 3px 12px rgba(59,130,246,.5);z-index:2"></div>
          <div class="map-pulse-ring" style="position:absolute;top:0;left:0;width:44px;height:44px;border-radius:50%;background:rgba(59,130,246,.2)"></div>
        </div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      className: "",
    });

    L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 })
      .addTo(map)
      .bindPopup(
        `<div style="text-align:center;padding:6px 4px">
          <div style="font-size:22px;margin-bottom:4px">📍</div>
          <b style="font-size:14px">Your Location</b>
          <div style="color:#888;font-size:11px;margin-top:2px">${userLat.toFixed(4)}, ${userLng.toFixed(4)}</div>
        </div>`
      );

    // Add store markers
    stores.forEach((store) => {
      if (!store.latitude || !store.longitude) return;

      const pin = L.divIcon({
        html: `<div style="position:relative;width:36px;height:44px">
          <div style="width:36px;height:36px;background:#0a8f08;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center">
            <span style="transform:rotate(45deg);font-size:16px">🏪</span>
          </div>
        </div>`,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
        popupAnchor: [0, -44],
        className: "",
      });

      const marker = L.marker([store.latitude, store.longitude], { icon: pin })
        .addTo(map)
        .bindPopup(
          `<div style="min-width:230px;padding:6px 2px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
              <h3 style="font-weight:700;font-size:14px;margin:0;color:#1a1a2e">${store.storeName}</h3>
              <span style="background:#dcfce7;color:#0a8f08;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px">${store.distance.toFixed(1)} km</span>
            </div>
            <p style="color:#999;font-size:12px;margin:0 0 6px">by ${store.ownerName}</p>
            <p style="color:#666;font-size:12px;margin:0">📍 ${store.address}, ${store.city}</p>
            <div style="margin-top:10px">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}" target="_blank" rel="noopener"
                style="background:#0a8f08;color:#fff;padding:5px 14px;border-radius:8px;font-size:11px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px">
                🧭 Get Directions
              </a>
            </div>
          </div>`
        );

      markersRef.current[store.id] = marker;
      marker.on("click", () => onStoreSelectRef.current?.(store.id));
    });

    // Fit map to the radius circle
    map.fitBounds(circle.getBounds(), { padding: [30, 30] });
  }, [stores, userLat, userLng, radiusKm]);

  // Clean up map on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.off();
        mapInstance.current.remove();
        mapInstance.current = null;
      }
      markersRef.current = {};
      if (wrapperRef.current) wrapperRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Legend bar */}
      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block border-2 border-white shadow" />
            You
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0a8f08] inline-block border-2 border-white shadow" />
            Partner stores
          </span>
          <span className="hidden sm:flex items-center border-l border-gray-200 pl-4 text-gray-400 gap-1.5">
            {/* Zone radius logo - Satellite Dish */}
            <svg className="w-4 h-4 flex-shrink-0 text-[#0a8f08]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3 Q8 8 8 12 Q8 16 12 16 Q16 16 16 12 Q16 8 12 3Z" opacity="0.5" />
              <path d="M10 14 Q8 14 8 16" stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M14 14 Q16 14 16 16" stroke="currentColor" fill="none" strokeWidth="1.2" strokeLinecap="round"/>
              <rect x="11" y="16" width="2" height="3" rx="0.5" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-xs">{radiusKm} km zone</span>
          </span>
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {stores.length} store{stores.length !== 1 ? "s" : ""} nearby
        </span>
      </div>
      {/* Map */}
      <div ref={wrapperRef} style={{ height: "560px", width: "100%" }} />
    </div>
  );
}
