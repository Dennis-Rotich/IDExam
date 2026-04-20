import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Settings,
  User2,
  LogOut,
  BarChart2,
  HelpCircle,
  Loader2,
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
import { type User } from "../types/auth";
import { getInitials } from "../utils/string";
import { resolvePathsByRole } from "../config/routes";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface ProfileDropdownProps {
  user: User;
  onLogOut: () => void | Promise<void>;
}

export function ProfileDropdown({ user, onLogOut }: ProfileDropdownProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const paths = resolvePathsByRole(user.role);
  const initials = getInitials(user.name);

  async function handleLogOut() {
    setIsLoggingOut(true);
    try {
      await onLogOut();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full border border-border hover:bg-muted"
          aria-label="Open profile menu"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
            <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-60" align="end" forceMount>
        {/* ── Header: identity block ── */}
        <DropdownMenuLabel className="font-normal px-3 py-2.5">
          <div className="flex items-center justify-start gap-1">
            <Avatar className="h-8 w-8 mt-0.5 shrink-0">
              <AvatarImage src={user.avatarUrl ?? ""} alt={user.name} />
              <AvatarFallback className="bg-muted text-foreground font-medium text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-0.5 min-w-0">
              {/* Name + verified badge */}
              <div className="flex items-center flex-wrap">
                <p className="text-sm font-semibold leading-none text-foreground">
                  {user.name}
                </p>
              </div>

              {/* Email */}
              <p className="text-xs text-muted-foreground truncate">
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
            <Link
              to={paths.profile}
              className="w-full flex items-center gap-2 text-foreground"
            >
              <User2 className="h-4 w-4 shrink-0" />
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
            <Link
              to={paths.analytics}
              className="w-full flex items-center text-foreground"
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              <span>
                {user.role === "instructor" ? "Analytics" : "My Results"}
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* ── Secondary actions ── */}
        <DropdownMenuGroup>
          {/* Account settings — name, email, password, preferences */}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              to={paths.settings}
              className="w-full flex items-center gap-2 text-foreground"
            >
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
            <Link
              to={paths.help}
              className="w-full flex items-center text-foreground"
            >
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
