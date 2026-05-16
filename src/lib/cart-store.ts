"use client";

import { create } from "zustand";
import type { CartItem, Product } from "@/lib/types";

interface CartStore {
  items: CartItem[];
  wishlist: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("sahakari-cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sahakari-cart", JSON.stringify(items));
}

function loadWishlist(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("sahakari-wishlist");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sahakari-wishlist", JSON.stringify(items));
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: loadCart(),
  wishlist: loadWishlist(),

  addItem: (product: Product) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        newItems = [...state.items, { product, quantity: 1 }];
      }
      saveCart(newItems);
      return { items: newItems };
    });
  },

  removeItem: (productId: string) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.product.id !== productId);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => {
      const newItems = state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
  },

  addToWishlist: (product: Product) => {
    set((state) => {
      const existing = state.wishlist.find((p) => p.id === product.id);
      if (existing) return state; // Already in wishlist
      const newWishlist = [...state.wishlist, product];
      saveWishlist(newWishlist);
      return { wishlist: newWishlist };
    });
  },

  removeFromWishlist: (productId: string) => {
    set((state) => {
      const newWishlist = state.wishlist.filter((p) => p.id !== productId);
      saveWishlist(newWishlist);
      return { wishlist: newWishlist };
    });
  },

  isInWishlist: (productId: string) => {
    return get().wishlist.some((p) => p.id === productId);
  },

  clearWishlist: () => {
    saveWishlist([]);
    set({ wishlist: [] });
  },
}));
