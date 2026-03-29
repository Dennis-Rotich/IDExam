import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Settings,
  User,
  LogOut,
  BarChart2,
  ShieldCheck,
  Bell,
  HelpCircle,
  Loader2
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "instructor" | "student" | "admin";

export interface ProfileUser {
  displayName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  department?: string;
  accessLevel?: string;
  lastActive?: string;
  isVerified?: boolean;
  unreadNotifications?: number;
  activeTests?: number;
  testsCompleted?: number;
  averageScore?: number;
}

// ─── Route Resolution ─────────────────────────────────────────────────────────

/**
 * Single source of truth for every route used in the dropdown.
 * Add new roles here — the component never needs to change.
 */
const ROLE_PATHS: Record<
  UserRole,
  {
    profile: string;
    settings: string;
    tests: string;
    analytics: string;
    notifications: string;
    help: string;
    /** Used externally (e.g. navbar header title). */
    dashboard: string;
  }
> = {
  instructor: {
    dashboard:     "/instructor",
    profile:       "/instructor/profile",
    settings:      "/instructor/settings",
    tests:         "/instructor/exams",
    analytics:     "/instructor/analytics",
    notifications: "/instructor/notifications",
    help:          "/instructor/help",
  },
  student: {
    dashboard:     "/student",
    profile:       "/student/profile",
    settings:      "/student/settings",
    tests:         "/student/exams",
    analytics:     "/student/results",
    notifications: "/student/notifications",
    help:          "/student/help",
  },
  admin: {
    dashboard:     "/admin",
    profile:       "/admin/profile",
    settings:      "/admin/settings",
    tests:         "/admin/tests",
    analytics:     "/admin/analytics",
    notifications: "/admin/notifications",
    help:          "/admin/help",
  },
};

/**
 * Resolves the full path map for a given role.
 * Import and call this wherever you need role-aware routes outside
 * the dropdown (e.g. the navbar header link, breadcrumbs).
 *
 * @example
 * const { dashboard, settings } = resolvePathsByRole("instructor");
 */
export function resolvePathsByRole(role: UserRole) {
  return ROLE_PATHS[role];
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ProfileDropdownProps {
  user: ProfileUser;
  /**
   * Called when the user confirms log out.
   * May return a Promise — the button shows a spinner until it resolves/rejects.
   */
  onLogOut: () => void | Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfileDropdown({ user, onLogOut }: ProfileDropdownProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const paths    = resolvePathsByRole(user.role);
  const initials = getInitials(user.displayName);
  const hasNotifications =
    user.unreadNotifications !== undefined && user.unreadNotifications > 0;

  async function handleLogOut() {
    setIsLoggingOut(true);
    try {
      await onLogOut();
    } finally {
      // If the parent navigates away on success this is a no-op.
      // If it throws we reset so the user can try again.
      setIsLoggingOut(false);
    }
  }

  return (
    <DropdownMenu>
      {/* ── Trigger ── */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full border border-border hover:bg-muted"
          aria-label="Open profile menu"
        >
          {/* Notification dot */}
          {hasNotifications && (
            <span
              className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background z-10"
              aria-hidden
            />
          )}
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl ?? ""} alt={user.displayName} />
            <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      {/* ── Content ── */}
      <DropdownMenuContent className="w-60" align="end" forceMount>

        {/* ── Header: identity block ── */}
        <DropdownMenuLabel className="font-normal px-3 py-2.5">
          <div className="flex items-start gap-2.5">
            <Avatar className="h-9 w-9 mt-0.5 shrink-0">
              <AvatarImage src={user.avatarUrl ?? ""} alt={user.displayName} />
              <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0.5 min-w-0">
              {/* Name + verified badge */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-sm font-semibold leading-none text-foreground truncate">
                  {user.displayName}
                </p>
                {user.isVerified && (
                  <ShieldCheck
                    className="h-3.5 w-3.5 text-emerald-500 shrink-0"
                    aria-label="Verified account"
                  />
                )}
              </div>

              {/* Email */}
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* ── Primary actions ── */}
        <DropdownMenuGroup>
          {/* Public-facing profile card — what others see */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={paths.profile} className="w-full flex items-center gap-2 text-foreground">
              <User className="h-4 w-4 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm leading-none">View Profile</span>
                <span className="text-[11px] leading-none text-muted-foreground mt-0.5">
                  Your public page
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          {/* Instructor → Analytics / Student → My Results */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={paths.analytics} className="w-full flex items-center text-foreground">
              <BarChart2 className="mr-2 h-4 w-4" />
              <span>{user.role === "instructor" ? "Analytics" : "My Results"}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ── Secondary actions ── */}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              to={paths.notifications}
              className="w-full flex items-center justify-between text-foreground"
            >
              <span className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </span>
              {hasNotifications && (
                <Badge className="h-4 min-w-4 px-1 text-[10px] rounded-full bg-destructive text-destructive-foreground">
                  {user.unreadNotifications! > 99 ? "99+" : user.unreadNotifications}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>

          {/* Account settings — name, email, password, preferences */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={paths.settings} className="w-full flex items-center gap-2 text-foreground">
              <Settings className="h-4 w-4 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm leading-none">Settings</span>
                <span className="text-[11px] leading-none text-muted-foreground mt-0.5">
                  Account, security & preferences
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to={paths.help} className="w-full flex items-center text-foreground">
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help &amp; Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ── Log out ── */}
        <DropdownMenuItem
          onClick={handleLogOut}
          disabled={isLoggingOut}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Signing out…</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}