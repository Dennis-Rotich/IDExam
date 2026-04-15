import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import { type User, type UserRole, type RegisterUserRequest, type LoginUserRequest } from "../types/auth";
import { loginUserApi, registerUserApi, getUserProfileApi } from "../api/auth"
import { apiClient } from "../lib/axiosApi";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signUp: (data: RegisterUserRequest) => Promise<void>;
  logIn: (data: LoginUserRequest) => Promise<void>;
  logOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // CRITICAL: Default to TRUE to block the router until we check local storage
  const [isLoading, setIsLoading] = useState(true);

  const logOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem("tahini_auth_token");
    delete apiClient.defaults.headers.common["Authorization"];
  }, []);

  // --- INITIALIZATION PHASE (Handles hard reloads) ---
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("tahini_auth_token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Ensure Axios knows about the token immediately on reload
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Fetch the active user's profile
        const response = await apiClient.get("/user/profile"); 
        // If successful, set the user state
        setUser(response.data.user);
      } catch (error) {
        console.error("Session restoration failed:", error);
        logOut(); // Clean up dead token
      } finally {
        setIsLoading(false); // Release the router
      }
    };

    initializeAuth();
  }, [logOut]);

  // --- AUTO-LOGOUT LISTENER (Handles 401 Unauthorized globally) ---
  useEffect(() => {
    const handleSessionExpiration = () => {
      logOut();
      toast.error("Your session has expired. Please log in again.", {
        duration: 5000,
      });
    };

    window.addEventListener("session-expired", handleSessionExpiration);

    return () => {
      window.removeEventListener("session-expired", handleSessionExpiration);
    };
  }, [logOut]);

  // This is the callback we pass to loginUserApi
  const setAuthData = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("tahini_auth_token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  async function signUp(data: RegisterUserRequest) {
    setIsLoading(true);
    try {
      await registerUserApi(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function logIn(data: LoginUserRequest) {
    setIsLoading(true);
    try {
      // 1. Await the API call and capture the returned payload
      const response = await loginUserApi(data);
      
      setAuthData(response.user, response.token); 
      
    } catch (error) {
       console.error("Login Context Error:", error);
       throw error; // Re-throw so the UI component can catch it and show an error toast
    } finally {
      setIsLoading(false);
    }
  }

  const refreshUser = async () => {
    try {
      const response = await getUserProfileApi();
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, logIn, logOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function useRole(): UserRole {
  const { user } = useAuth();
  if (!user) throw new Error("useRole: no authenticated user");
  return user.role;
}