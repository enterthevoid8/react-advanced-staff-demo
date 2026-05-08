import { create } from "zustand";

type Toast = {
  id: string;
  message: string;
};

type UIState = {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  toasts: Toast[];
  toggleSidebar(): void;
  openCommandPalette(): void;
  closeCommandPalette(): void;
  pushToast(message: string): void;
  dismissToast(id: string): void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  toasts: [],

  toggleSidebar() {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  openCommandPalette() {
    set({ commandPaletteOpen: true });
  },

  closeCommandPalette() {
    set({ commandPaletteOpen: false });
  },

  pushToast(message) {
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message }]
    }));
  },

  dismissToast(id) {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  }
}));