// ─── Product type used on the client side ────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  mrp: number;
  unit: string;
  image: string;
  inStock: boolean;
  categoryId: string;
  category?: Category;
  storeId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StorePartner {
  id: string;
  storeName: string;
  ownerName: string;
  mobile: string;
  email?: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  category: string;
  isActive: boolean;
}

export interface InvestorFormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  profession: string;
  investment: string;
  notes: string;
}

export interface NearbyStore {
  id: string;
  storeName: string;
  ownerName: string;
  mobile: string;
  address: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  distance: number; // in km
  category: string;
}

// ─── NextAuth Type Extensions ────────────────────────────────────────
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
