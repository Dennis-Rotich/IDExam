import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "student" | "instructor" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (userData: User, token: string) => void;
  logout: () => void;
  setLoading: (status: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (userData, token) => 
        set({ 
          user: userData, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        }),

      setLoading: (status) => 
        set({ isLoading: status }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "tahini-auth-storage", // Key used in localStorage
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), // Don't persist isLoading state
    }
  )
);