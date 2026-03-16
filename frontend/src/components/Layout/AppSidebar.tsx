import {
  LayoutDashboard,
  FileCode2,
  Database,
  MonitorPlay,
  Menu,
  GraduationCap,
  Code,
  FileCheck
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
} from "../ui/sidebar"; // Adjust alias to match your tsconfig

// INSTRUCTOR LINKS
const instructorNav = [
  { title: "Overview", icon: LayoutDashboard, url: "/instructor" },
  { title: "Exam Manager", icon: FileCode2, url: "/instructor/exams" },
  { title: "Question Bank", icon: Database, url: "/instructor/questions" },
  {
    title: "Live Proctoring",
    icon: MonitorPlay,
    url: "/instructor/proctoring",
  },
];

// STUDENT LINKS
const studentNav = [
  { title: "Overview", icon: GraduationCap, url: "/student" },
  { title: "Practice", icon: Code, url: "/student/practice" },
  { title: "Past Results", icon: FileCheck, url: "/student/results" },
];

export function AppSidebar({
  role = "instructor",
}: {
  role?: "instructor" | "student";
}) {
  const location = useLocation();
  const navItems = role === "instructor" ? instructorNav : studentNav;
  const label = role === "instructor" ? "Instructor Panel" : "Student Portal";

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
