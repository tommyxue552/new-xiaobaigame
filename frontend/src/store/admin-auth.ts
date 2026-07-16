/** Admin auth store using Zustand with localStorage persistence. */

import { create } from "zustand";
import type { AdminInfo } from "@/types/admin";

interface AdminAuthState {
  token: string | null;
  admin: AdminInfo | null;
  isAuthenticated: boolean;
  login: (token: string, admin: AdminInfo) => void;
  logout: () => void;
  hydrate: () => void;
}

const TOKEN_KEY = "admin_token";
const ADMIN_KEY = "admin_info";

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  token: null,
  admin: null,
  isAuthenticated: false,

  login: (token: string, admin: AdminInfo) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
    }
    set({ token, admin, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
    }
    set({ token: null, admin: null, isAuthenticated: false });
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      const adminStr = localStorage.getItem(ADMIN_KEY);
      if (token && adminStr) {
        try {
          const admin = JSON.parse(adminStr) as AdminInfo;
          set({ token, admin, isAuthenticated: true });
        } catch {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(ADMIN_KEY);
        }
      }
    }
  },
}));
