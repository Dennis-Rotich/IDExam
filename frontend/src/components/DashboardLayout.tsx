import { Outlet, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { DashboardPageLoading } from "../pages/Loading/DashboardPageLoading";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./Layout/AppSidebar";
import { ProfileDropdown } from "./ProfileUser";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export function DashboardLayout() {
  const { user, isLoading: authLoading, logOut } = useAuth();
  const navigate = useNavigate();
  const [isDemoLoading, setIsDemoLoading] = useState(true);

  useEffect(() => {
    // Set the delay in milliseconds (3000ms = 3 seconds)
    const timer = setTimeout(() => {
      setIsDemoLoading(false);
    }, 3000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Show the skeleton if auth is still checking OR if our demo timer is still running
  const isLoading = authLoading || isDemoLoading;

  if (isLoading) {
    return <DashboardPageLoading />;
  }

  // Route Guard: If no user, boot to login
  if (!user) return <Navigate to="/auth/student" replace />;

  const headerTitle =
    user.role === "instructor"
      ? "Instructor Dashboard"
      : user.role === "admin"
        ? "Admin Portal"
        : "Student Portal";

  const handleLogOut = async () => {
    const currentRole = user.role;
    await logOut();
    navigate(`/auth/${currentRole}`);
  };

  return (
    <SidebarProvider>
      {/* Role prop is removed; AppSidebar will fetch it directly from context */}
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background text-foreground">
        <header className="flex h-14 items-center gap-4 border-b border-border bg-background lg:h-[60px] px-6">
          <div className="flex-1">
            <h1 className="text-sm text-left font-semibold text-muted-foreground">
              {headerTitle}
            </h1>
          </div>

          <ProfileDropdown user={user} onLogOut={handleLogOut} />
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-6 bg-background">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
