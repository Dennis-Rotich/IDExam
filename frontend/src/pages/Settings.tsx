// pages/Settings.tsx
import { User, Shield, Server, Users, GraduationCap } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useAuth } from "../context/AuthContext";
import { type UserRole } from "../config/routes";

// Import your newly modularized tabs
import { AccountTab } from "../components/Settings/Tabs/AccountTab";
import { SecurityTab } from "../components/Settings/Tabs/SecurityTab";
import { StudentLearningTab } from "../components/Settings/Tabs/StudentLearningTab";
// import { StudentLearningTab } from "../components/Settings/Tabs/StudentLearningTab";
// import { AdminPlatformTab } from "../components/Settings/Tabs/AdminPlatformTab";

const PAGE_META: Record<
  UserRole,
  { subtitle: string; badgeColor: string; badgeLabel: string }
> = {
  instructor: {
    subtitle: "Manage your instructor account and security.",
    badgeColor: "bg-amber-100 text-amber-800",
    badgeLabel: "Instructor",
  },
  student: {
    subtitle: "Manage your student profile and learning preferences.",
    badgeColor: "bg-sky-100 text-sky-800",
    badgeLabel: "Student",
  },
  admin: {
    subtitle: "Platform-wide configuration and user management.",
    badgeColor: "bg-rose-100 text-rose-800",
    badgeLabel: "Admin",
  },
};

const ROLE_TABS: Record<
  UserRole,
  { value: string; icon: any; label: string }[]
> = {
  instructor: [
    { value: "account", icon: User, label: "Account" },
    { value: "security", icon: Shield, label: "Security" },
  ],
  student: [
    { value: "account", icon: User, label: "Account" },
    { value: "learning", icon: GraduationCap, label: "Learning" },
    { value: "security", icon: Shield, label: "Security" },
  ],
  admin: [
    { value: "platform", icon: Server, label: "Platform" },
    { value: "users", icon: Users, label: "Users" },
    { value: "security", icon: Shield, label: "Security" },
  ],
};

export function Settings() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex justify-center h-48 items-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  const role: UserRole = user.role;
  const meta = PAGE_META[role];
  const tabs = ROLE_TABS[role];

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground px-2">
      {/* Header */}
      <div className="text-left flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Settings
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{meta.subtitle}</p>
        </div>
        <Badge
          variant="outline"
          className={`text-xs px-2 py-0.5 font-medium mt-1 border-transparent ${meta.badgeColor}`}
        >
          {meta.badgeLabel}
        </Badge>
      </div>

      {/* Dynamic Tabs */}
      <Tabs defaultValue={tabs[0].value} className="space-y-4">
        <TabsList
          className="grid w-full bg-muted"
          style={{
            gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`,
            maxWidth: `${tabs.length * 130}px`,
          }}
        >
          {tabs.map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="w-4 h-4 mr-2" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Routing */}
        <TabsContent value="account">
          <AccountTab user={user} role={role} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="account">
          <AccountTab user={user} role={role} />
        </TabsContent>

        <TabsContent value="security">
          <StudentLearningTab user={user} />
        </TabsContent>
        {role === "student" && (
          <TabsContent value="learning">
            <StudentLearningTab user={user} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
