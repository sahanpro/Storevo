import { create } from "zustand";

type CartItem = { variantId: string; quantity: number };

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items.filter((i) => i.variantId !== item.variantId), item] })),
  removeItem: (variantId) => set((s) => ({ items: s.items.filter((i) => i.variantId !== variantId) })),
  clear: () => set({ items: [] })
}));
