import { createContext, useContext, useState, type ReactNode } from "react";
import { type UserRole, type ProfileUser } from "../components/ProfileUser";

// --- Mock Data ---
const INSTRUCTOR_STUB: ProfileUser = {
  displayName: "Jane Doe",
  email: "jane@tahini.com",
  role: "instructor",
  isVerified: true,
  unreadNotifications: 3,
  activeTests: 7,
};

const STUDENT_STUB: ProfileUser = {
  displayName: "John Doe",
  email: "john@tahini.com",
  role: "student",
  isVerified: false,
  unreadNotifications: 0,
  testsCompleted: 12,
  averageScore: 84,
};

const ADMIN_STUB: ProfileUser = {
  displayName: "John Doe",
  email: "admin@tahini.edu",
  role: "admin",
  isVerified: true,
  unreadNotifications: 5,
  // Optional: Admin-specific fields (if your interface supports them)
  department: "Platform Operations",
  accessLevel: "Superadmin",
  lastActive: "Just now",
};

// --- Types ---
interface AuthContextValue {
  user: ProfileUser | null;
  isLoading: boolean;
  signUp: (role: UserRole) => Promise<void>;
  logIn: (role: UserRole) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start as null to simulate a fresh, unauthenticated session
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function signUp(role: UserRole){
    setIsLoading(true);
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 800));
    
    if (role === "instructor") {
      setUser(INSTRUCTOR_STUB);
    } else if (role === "admin"){
      setUser(ADMIN_STUB);
    } else {
      setUser(STUDENT_STUB);
    }
    
    setIsLoading(false);
  }

  async function logIn(role: UserRole) {
    setIsLoading(true);
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 800));
    
    if (role === "instructor") {
      setUser(INSTRUCTOR_STUB);
    } else if (role === "admin"){
      setUser(ADMIN_STUB);
    } else {
      setUser(STUDENT_STUB);
    }
    
    setIsLoading(false);
  }

  async function logOut() {
    setIsLoading(true);
    // Simulate network latency
    await new Promise((res) => setTimeout(res, 800));
    setUser(null);
    setIsLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Hooks ---
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