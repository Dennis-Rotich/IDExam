export type UserRole = "instructor" | "student" | "admin";

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
    dashboard: "/instructor",
    profile: "/instructor/profile",
    settings: "/instructor/settings",
    tests: "/instructor/exams",
    analytics: "/instructor",
    notifications: "/instructor/notifications",
    help: "/instructor/help",
  },
  student: {
    dashboard: "/student",
    profile: "/student/profile",
    settings: "/student/settings",
    tests: "/student/exams",
    analytics: "/student/results",
    notifications: "/student/notifications",
    help: "/student/help",
  },
  admin: {
    dashboard: "/admin",
    profile: "/admin/profile",
    settings: "/admin/settings",
    tests: "/admin/tests",
    analytics: "/admin/analytics",
    notifications: "/admin/notifications",
    help: "/admin/help",
  },
};

/**
 * Resolves the full path map for a given role.
 */
export function resolvePathsByRole(role: UserRole) {
  return ROLE_PATHS[role];
}