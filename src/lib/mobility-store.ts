import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface MobilityBooking {
  id?: string;
  rideNumber?: string;
  serviceType: "cab" | "bike" | "truck";
  pickup: Location;
  dropoff: Location;
  loadType?: "small" | "medium" | "large";
  helperNeeded?: boolean;
  estimatedDistance?: number;
  estimatedDuration?: number;
  estimatedFare?: number;
  actualFare?: number;
  status?: string;
  specialNotes?: string;
}

export interface LiveLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface DriverInfo {
  id: string;
  name: string;
  rating: number;
  phone: string;
  profileImage?: string;
  currentLocation?: LiveLocationData;
  eta?: number; // in minutes
  vehicle?: {
    type: string;
    make: string;
    model: string;
    registrationNumber: string;
    color: string;
  };
}

export interface MobilityState {
  // Booking State
  currentBooking: MobilityBooking | null;
  bookingHistory: MobilityBooking[];
  
  // Driver State
  assignedDriver: DriverInfo | null;
  isSearchingDriver: boolean;
  searchTimeout?: number;
  
  // Live Tracking
  isLiveTracking: boolean;
  driverLocation: LiveLocationData | null;
  riderLocation: LiveLocationData | null;
  
  // UI State
  activeTab: "book" | "track" | "history";
  selectedServiceType: "cab" | "bike" | "truck";
  
  // User Role
  userRole: "rider" | "driver" | null;
  driverStatus: "offline" | "online" | "on_ride" | null;
  
  // Actions
  setCurrentBooking: (booking: MobilityBooking | null) => void;
  addToHistory: (booking: MobilityBooking) => void;
  clearHistory: () => void;
  
  setAssignedDriver: (driver: DriverInfo | null) => void;
  setIsSearchingDriver: (searching: boolean) => void;
  setSearchTimeout: (timeout: number) => void;
  
  setIsLiveTracking: (tracking: boolean) => void;
  updateDriverLocation: (location: LiveLocationData) => void;
  updateRiderLocation: (location: LiveLocationData) => void;
  
  setActiveTab: (tab: "book" | "track" | "history") => void;
  setSelectedServiceType: (type: "cab" | "bike" | "truck") => void;
  
  setUserRole: (role: "rider" | "driver" | null) => void;
  setDriverStatus: (status: "offline" | "online" | "on_ride" | null) => void;
  
  // Utility
  resetBooking: () => void;
}

export const useMobilityStore = create<MobilityState>()(
  persist(
    (set) => ({
      // Initial State
      currentBooking: null,
      bookingHistory: [],
      assignedDriver: null,
      isSearchingDriver: false,
      searchTimeout: undefined,
      isLiveTracking: false,
      driverLocation: null,
      riderLocation: null,
      activeTab: "book",
      selectedServiceType: "cab",
      userRole: null,
      driverStatus: null,

      // Actions
      setCurrentBooking: (booking) => set({ currentBooking: booking }),
      
      addToHistory: (booking) =>
        set((state) => ({
          bookingHistory: [booking, ...state.bookingHistory].slice(0, 50), // Keep last 50
        })),
      
      clearHistory: () => set({ bookingHistory: [] }),
      
      setAssignedDriver: (driver) => set({ assignedDriver: driver }),
      
      setIsSearchingDriver: (searching) => set({ isSearchingDriver: searching }),
      
      setSearchTimeout: (timeout) => set({ searchTimeout: timeout }),
      
      setIsLiveTracking: (tracking) => set({ isLiveTracking: tracking }),
      
      updateDriverLocation: (location) => set({ driverLocation: location }),
      
      updateRiderLocation: (location) => set({ riderLocation: location }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setSelectedServiceType: (type) => set({ selectedServiceType: type }),
      
      setUserRole: (role) => set({ userRole: role }),
      
      setDriverStatus: (status) => set({ driverStatus: status }),
      
      resetBooking: () =>
        set({
          currentBooking: null,
          assignedDriver: null,
          isSearchingDriver: false,
          isLiveTracking: false,
          driverLocation: null,
        }),
    }),
    {
      name: "mobility-store", // localStorage key
    }
  )
);
