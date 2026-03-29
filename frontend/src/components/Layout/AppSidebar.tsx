import {
  LayoutDashboard,
  Database,
  MonitorPlay,
  Menu,
  GraduationCap,
  Code,
  ClipboardList,
  BookOpen,
  Users,
  ShieldAlert,
  BarChart2,
  Terminal,
  Megaphone,
  FileText,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarTrigger,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { resolvePathsByRole, type UserRole } from "../ProfileUser";
import { useRole } from "../../context/AuthContext"; // Adjust import path as needed

interface NavItem {
  title: string;
  icon: React.ElementType;
  url: string;
}

const INSTRUCTOR_NAV: NavItem[] = [
  { title: "Overview",        icon: LayoutDashboard, url: "/instructor" },
  { title: "Question Bank",   icon: Database,        url: "/instructor/questions" },
  { title: "Live Proctoring", icon: MonitorPlay,     url: "/instructor/proctoring" },
];

const STUDENT_NAV: NavItem[] = [
  { title: "Overview", icon: GraduationCap, url: "/student" },
  { title: "Results",  icon: ClipboardList, url: "/student/results" },
  { title: "Practice", icon: Code,          url: "/student/practice" },
];

const ADMIN_NAV: NavItem[] = [
  { title: "Overview",       icon: LayoutDashboard, url: "/admin" },
  { title: "Users",          icon: Users,           url: "/admin/users" },
  { title: "Test Oversight", icon: ClipboardList,   url: "/admin/tests" },
  { title: "Proctoring",     icon: ShieldAlert,     url: "/admin/proctoring" },
  { title: "Analytics",      icon: BarChart2,       url: "/admin/analytics" },
  { title: "Audit Log",      icon: Terminal,        url: "/admin/audit" },
  { title: "Announcements",  icon: Megaphone,       url: "/admin/announcements" },
  { title: "System Docs",    icon: FileText,        url: "/admin/docs" },
  { title: "Settings",       icon: Settings,        url: "/admin/settings" },
];

  // Note: Ensure UserRole in ProfileUser includes "admin" if you keep this mapping
const ROLE_META: Record<UserRole | "admin", { label: string }> = {
  instructor: { label: "Instructor Panel" },
  student:    { label: "Student Portal" },
  admin:      { label: "Admin Command Centre" }
};

function testsNavItem(role: UserRole): NavItem {
  const { tests } = resolvePathsByRole(role);
  return role === "instructor"
    ? { title: "Exam Manager", icon: ClipboardList, url: tests }
    : { title: "My Tests",     icon: BookOpen,      url: tests };
}

export function AppSidebar() {
  const location = useLocation();
  // Fetch role directly from context. Throws an error if unauthenticated.
  const role = useRole() as UserRole | "admin"; 

  const { label } = ROLE_META[role] || { label: "Portal" };

  let navItems: NavItem[] = [];

  // Generate the nav array based on the role
  if (role === "admin") {
    navItems = ADMIN_NAV;
  } else {
    const baseNav = role === "instructor" ? INSTRUCTOR_NAV : STUDENT_NAV;
    navItems = [
      baseNav[0],           
      testsNavItem(role as UserRole),   
      ...baseNav.slice(1),  
    ];
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{label}</SidebarGroupLabel>
          <SidebarTrigger>
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}