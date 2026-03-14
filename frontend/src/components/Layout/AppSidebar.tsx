import {
  LayoutDashboard,
  FileCode2,
  Database,
  MonitorPlay,
  Settings,
  Menu,
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

const navItems = [
  { title: "Overview", icon: LayoutDashboard, url: "/instructor" },
  { title: "Exam Manager", icon: FileCode2, url: "/instructor/exams" },
  { title: "Question Bank", icon: Database, url: "/instructor/questions" },
  {
    title: "Live Proctoring",
    icon: MonitorPlay,
    url: "/instructor/proctoring",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Instructor Panel</SidebarGroupLabel>
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
