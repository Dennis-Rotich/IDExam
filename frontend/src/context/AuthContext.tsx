import { createContext, useContext, useState, type ReactNode } from "react";
import { type User, type UserRole, type RegisterUserRequest, type LoginUserRequest } from "../types/auth";
import { loginUserApi, registerUserApi } from "../api/auth"
import { apiClient } from "../lib/axiosApi";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signUp: (data: RegisterUserRequest) => Promise<void>;
  logIn: (data: LoginUserRequest) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // This is the callback we pass to loginUserApi
  const setAuthData = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
    // The apiClient.defaults.headers assignment is already handled inside loginUserApi, 
    // but storing it here ensures React state updates.
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
      await loginUserApi(data, setAuthData);
    } finally {
      setIsLoading(false);
    }
  }

  function logOut() {
    setUser(null);
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, logIn, logOut }}>
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