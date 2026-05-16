/**
 * Socket.io Configuration and Utilities
 * For real-time location tracking and ride updates
 */

declare global {
  interface Window {
    io?: (...args: any[]) => any;
  }
}

export class MobilitySocketManager {
  private socket: any = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private isConnected: boolean = false;
  private simulationIntervals: ReturnType<typeof setInterval>[] = [];

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Initialize Socket connection (client-side stub for now)
   * In production, this would connect to a Socket.io server
   */
  connect(serverUrl: string = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000") {
    console.log("Initializing mobility socket connection...");

    // Check if Socket.io is available
    if (typeof window === "undefined") return;

    // Guard: prevent stacking multiple intervals on repeated connect() calls
    if (this.isConnected || this.simulationIntervals.length > 0) return;

    if (!window.io) {
      console.warn("Socket.io not loaded. Using polling fallback.");
      this.simulateSocketEvents();
      return;
    }

    // In production, connect like this:
    // this.socket = io(serverUrl, {
    //   auth: { token: authToken },
    //   reconnection: true,
    //   reconnectionDelay: 1000,
    //   reconnectionDelayMax: 5000,
    //   reconnectionAttempts: 5,
    // });

    // For development, simulate socket events
    this.simulateSocketEvents();
    this.isConnected = true;
  }

  /**
   * Stop all simulation intervals (called on disconnect)
   */
  private clearSimulationIntervals() {
    this.simulationIntervals.forEach((id) => clearInterval(id));
    this.simulationIntervals = [];
  }

  /**
   * Subscribe to an event
   */
  on(eventName: string, callback: Function) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)?.add(callback);
  }

  /**
   * Unsubscribe from an event
   */
  off(eventName: string, callback: Function) {
    this.listeners.get(eventName)?.delete(callback);
  }

  /**
   * Emit an event
   */
  emit(eventName: string, data?: any) {
    if (this.socket) {
      this.socket.emit(eventName, data);
    } else {
      console.log(`[Socket Emitter] ${eventName}:`, data);
    }
  }

  /**
   * Simulate socket events for development
   */
  private simulateSocketEvents() {
    // Simulate driver location updates
    const locationInterval = setInterval(() => {
      const mockLocationEvent = {
        userId: "driver-123",
        latitude: 28.7041 + (Math.random() - 0.5) * 0.01,
        longitude: 77.1025 + (Math.random() - 0.5) * 0.01,
        speed: Math.floor(Math.random() * 60),
        accuracy: Math.random() * 10,
        heading: Math.floor(Math.random() * 360),
        timestamp: new Date().toISOString(),
      };

      this.notifyListeners("driver:location-update", mockLocationEvent);
    }, 3000); // Update every 3 seconds

    // Simulate ride status updates
    const statusInterval = setInterval(() => {
      this.notifyListeners("ride:status-update", {
        rideId: "ride-123",
        status: "in_progress",
        eta: Math.floor(Math.random() * 20) + 5,
      });
    }, 5000);

    this.simulationIntervals.push(locationInterval, statusInterval);
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(eventName: string, data: any) {
    const callbacks = this.listeners.get(eventName);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    this.clearSimulationIntervals();
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isConnected = false;
  }

  /**
   * Check if connected
   */
  get isSocketConnected(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
export const mobilitySocket = new MobilitySocketManager();

/**
 * Real-time location broadcasting utilities
 */
export class LocationBroadcaster {
  private watchId: number | null = null;
  private isTracking: boolean = false;

  /**
   * Start tracking user location and broadcast it
   */
  startTracking(onLocationUpdate?: (location: GeolocationCoordinates) => void) {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    if (this.isTracking) {
      console.warn("Already tracking location");
      return;
    }

    this.isTracking = true;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, heading, speed } =
          position.coords;

        const locationData = {
          latitude,
          longitude,
          accuracy,
          heading,
          speed,
          timestamp: new Date().toISOString(),
        };

        // Broadcast to server
        mobilitySocket.emit("location:update", locationData);

        // Call callback if provided
        if (onLocationUpdate) {
          onLocationUpdate(position.coords);
        }
      },
      (error) => {
        console.error("Geolocation error:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /**
   * Stop tracking location
   */
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      this.isTracking = false;
    }
  }

  /**
   * Get current location (one-time)
   */
  getCurrentLocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}

/**
 * Distance and Fare Calculation Utils with Dynamic Demand Pricing
 */
export class FareCalculator {
  // Minimum base fares (thresholds - prices won't go below these)
  private static MIN_BASE_FARES = {
    cab: 50, // ₹50 minimum base fare
    bike: 20, // ₹20 minimum base fare
    truck: 100, // ₹100 minimum base fare
  };

  // Minimum rate per km (thresholds - won't go below these)
  private static MIN_DISTANCE_RATES = {
    cab: 15, // ₹15 per km minimum
    bike: 8, // ₹8 per km minimum
    truck: 25, // ₹25 per km minimum
  };

  /**
   * Calculate distance between two coordinates using Haversine formula
   * Returns distance in kilometers
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
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
  }

  /**
   * Calculate demand multiplier based on various factors
   * Factors: time of day, day of week, active rides count
   * Returns: multiplier between 1.0 (no surge) and 2.0 (max surge)
   */
  private static calculateDemandMultiplier(
    _activeRidesCount: number = 0
  ): number {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday

    let multiplier = 1.0;

    // Peak hour surge: 7-10 AM (morning rush)
    if (hour >= 7 && hour <= 10) {
      multiplier = Math.min(2.0, 1.35); // 1.35x during morning
    }
    // Afternoon lull: 11 AM - 4 PM
    else if (hour >= 11 && hour < 16) {
      multiplier = 1.0; // Normal rate
    }
    // Evening peak: 5-8 PM
    else if (hour >= 17 && hour <= 20) {
      multiplier = Math.min(2.0, 1.5); // 1.5x during evening
    }
    // Night time: 8 PM - 6 AM
    else if (hour >= 20 || hour < 7) {
      multiplier = Math.min(2.0, 1.25); // 1.25x at night
    }

    // Weekend boost: Saturday & Sunday
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      multiplier = Math.min(2.0, multiplier * 1.1); // +10% on weekends
    }

    // Simulate active rides affecting demand (0-5 active rides = 1.0-1.3x)
    const rideDemandBoost = Math.min(0.3, (_activeRidesCount / 100) * 0.3);
    multiplier = Math.min(2.0, multiplier + rideDemandBoost);

    return Math.max(1.0, multiplier); // Never below 1.0
  }

  /**
   * Get current demand level as a readable string
   */
  static getDemandLevel(): string {
    const multiplier = this.calculateDemandMultiplier();

    if (multiplier <= 1.0) return "Low";
    if (multiplier < 1.15) return "Normal";
    if (multiplier < 1.3) return "Moderate";
    if (multiplier < 1.5) return "High";
    return "Very High";
  }

  /**
   * Get current demand multiplier (for display purposes)
   */
  static getDemandMultiplier(): number {
    return Number(this.calculateDemandMultiplier().toFixed(2));
  }

  /**
   * Estimate fare based on distance and service type with dynamic demand pricing
   * Formula: (Base + Distance × Rate) × Demand Multiplier
   * But never below minimum thresholds
   */
  static estimateFare(
    distance: number,
    serviceType: "cab" | "bike" | "truck",
    activeRidesCount: number = 0
  ): number {
    const minBaseFare = this.MIN_BASE_FARES[serviceType] || 50;
    const minDistanceRate = this.MIN_DISTANCE_RATES[serviceType] || 15;

    // Calculate demand multiplier
    const demandMultiplier = this.calculateDemandMultiplier(activeRidesCount);

    // Calculate fare with demand multiplier
    const baseWithDemand = minBaseFare * demandMultiplier;
    const rateWithDemand = minDistanceRate * demandMultiplier;
    const fare = baseWithDemand + distance * rateWithDemand;

    // Ensure we never go below minimum base fare + distance
    const minimumFare = minBaseFare + distance * minDistanceRate;

    // Return the higher of the two (demand-based or minimum)
    return Math.round(Math.max(minimumFare, fare));
  }

  /**
   * Get fare breakdown for display
   */
  static getFareBreakdown(
    distance: number,
    serviceType: "cab" | "bike" | "truck",
    activeRidesCount: number = 0
  ): {
    baseAmount: number;
    distanceAmount: number;
    subtotal: number;
    tax: number;
    total: number;
    demandMultiplier: number;
    demandLevel: string;
  } {
    const minBaseFare = this.MIN_BASE_FARES[serviceType] || 50;
    const minDistanceRate = this.MIN_DISTANCE_RATES[serviceType] || 15;
    const demandMultiplier = this.calculateDemandMultiplier(activeRidesCount);

    const baseAmount = Math.round(minBaseFare * demandMultiplier);
    const distanceAmount = Math.round(distance * minDistanceRate * demandMultiplier);
    const subtotal = baseAmount + distanceAmount;

    // Ensure minimum
    const minimumSubtotal = Math.round(minBaseFare + distance * minDistanceRate);
    const finalSubtotal = Math.max(subtotal, minimumSubtotal);

    const tax = Math.round(finalSubtotal * 0.05); // 5% tax
    const total = finalSubtotal + tax;

    return {
      baseAmount: Math.max(minBaseFare, baseAmount),
      distanceAmount: Math.max(
        Math.round(distance * minDistanceRate),
        distanceAmount
      ),
      subtotal: finalSubtotal,
      tax,
      total,
      demandMultiplier: Number(demandMultiplier.toFixed(2)),
      demandLevel: this.getDemandLevel(),
    };
  }

  /**
   * Estimate ride duration based on distance
   * Average speed: 30 km/h in traffic
   */
  static estimateDuration(distanceKm: number): number {
    const averageSpeedKmh = 30;
    const durationMinutes = Math.ceil((distanceKm / averageSpeedKmh) * 60);
    return Math.max(5, durationMinutes); // Minimum 5 minutes
  }
}

/**
 * Driver Matching Algorithm
 */
export class DriverMatcher {
  /**
   * Find nearest drivers to pickup location
   * In production, this would query the backend
   */
  static async findNearestDrivers(
    pickupLat: number,
    pickupLon: number,
    serviceType: "cab" | "bike" | "truck",
    radius: number = 5 // 5 km radius
  ): Promise<any[]> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock drivers
        const mockDrivers = [
          {
            id: "driver-001",
            name: "Raj Kumar",
            rating: 4.8,
            phone: "+91 98765 43210",
            distance: 1.2,
            eta: 4,
            vehicle: {
              type: serviceType,
              make: "Toyota",
              model: "Innova",
              registrationNumber: "DL01AB1234",
              color: "Silver",
            },
          },
          {
            id: "driver-002",
            name: "Priya Singh",
            rating: 4.9,
            phone: "+91 98765 43211",
            distance: 2.3,
            eta: 7,
            vehicle: {
              type: serviceType,
              make: "Maruti",
              model: "Swift",
              registrationNumber: "DL02AB5678",
              color: "Red",
            },
          },
          {
            id: "driver-003",
            name: "Arjun Patel",
            rating: 4.7,
            phone: "+91 98765 43212",
            distance: 3.1,
            eta: 9,
            vehicle: {
              type: serviceType,
              make: "Hyundai",
              model: "i20",
              registrationNumber: "DL03AB9012",
              color: "Blue",
            },
          },
        ];

        resolve(mockDrivers);
      }, 1000); // Simulate network delay
    });
  }

  /**
   * Assign best driver based on criteria
   */
  static selectBestDriver(drivers: any[]): any | null {
    if (drivers.length === 0) return null;

    // Sort by rating and distance
    return drivers.sort((a, b) => {
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) return ratingDiff;
      return a.distance - b.distance;
    })[0];
  }
}
