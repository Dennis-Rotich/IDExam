import { Outlet, Link } from "react-router-dom";
import { LogOut, Settings, User } from "lucide-react";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./Layout/AppSidebar";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function DashboardLayout({
  role = "instructor",
}: {
  role?: "instructor" | "student";
}) {
  const settingsPath =
    role === "instructor" ? "/instructor/settings" : "/student/settings";
  const profilePath = role === "instructor" ? "/instructor" : "/student";
  const headerTitle =
    role === "instructor" ? "Instructor Dashboard" : "Student Dashboard";

  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        {/* Header Bar */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40  lg:h-[60px] p-2">
          <div className="flex-1">
            <h1 className="text-sm text-left font-semibold text-muted-foreground">
              {headerTitle}
            </h1>
          </div>

          {/* User Profile Dropdown */}
          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full border border-slate-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="@user" />
                    <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                      {role === "instructor" ? "IN" : "ST"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900">
                      {role === "instructor" ? "Instructor Admin" : "Student"}
                    </p>
                    <p className="text-xs leading-none text-slate-500">
                      user@tahini.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      to={settingsPath}
                      className="cursor-pointer w-full flex items-center text-slate-700"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={profilePath}
                      className="cursor-pointer w-full flex items-center text-slate-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto lg:p-1">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
