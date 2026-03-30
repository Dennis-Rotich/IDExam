import {
  Save,
  Bell,
  Shield,
  User,
  UploadCloud,
  Users,
  Server,
  KeyRound,
  Building2,
  GraduationCap,
  BarChart2,
  Accessibility,
  Globe,
  Sliders,
} from "lucide-react";
import { Button }      from "../components/ui/button";
import { Input }       from "../components/ui/input";
import { Textarea }    from "../components/ui/textarea";
import { Switch }      from "../components/ui/switch";
import { Label }       from "../components/ui/label";
import { Badge }       from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { type UserRole } from "../components/ProfileUser";
import { useAuth } from "../context/AuthContext";

// ─── Shared: Save footer ─────────────────────────────────────────────────────

function SaveFooter({ label = "Save Changes" }: { label?: string }) {
  return (
    <CardFooter className="border-t border-border px-6 py-4">
      <Button className="bg-foreground text-background hover:bg-foreground/90">
        <Save className="w-4 h-4 mr-2" />
        {label}
      </Button>
    </CardFooter>
  );
}

// ─── Shared: Notification row ─────────────────────────────────────────────────

function NotifRow({
  label,
  description,
  defaultChecked = false,
  destructive = false,
}: {
  label: string;
  description: string;
  defaultChecked?: boolean;
  destructive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
      <div className="space-y-0.5">
        <Label className={`text-base ${destructive ? "text-destructive" : "text-foreground"}`}>
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

// ─── Shared: Password block ───────────────────────────────────────────────────

function PasswordBlock() {
  return (
    <div className="space-y-4">
      <div className="space-y-2 max-w-xl">
        <Label htmlFor="current" className="text-foreground">Current Password</Label>
        <Input id="current" type="password" className="bg-background border-border text-foreground" />
      </div>
      <div className="space-y-2 max-w-xl">
        <Label htmlFor="new" className="text-foreground">New Password</Label>
        <Input id="new" type="password" className="bg-background border-border text-foreground" />
      </div>
      <div className="space-y-2 max-w-xl">
        <Label htmlFor="confirm" className="text-foreground">Confirm New Password</Label>
        <Input id="confirm" type="password" className="bg-background border-border text-foreground" />
      </div>
    </div>
  );
}

// ─── Role meta ────────────────────────────────────────────────────────────────

const PAGE_META: Record<UserRole, { subtitle: string; badgeColor: string; badgeLabel: string }> = {
  instructor: {
    subtitle:    "Manage your instructor account, notification preferences, and security.",
    badgeColor:  "bg-amber-100 text-amber-800 border-amber-200",
    badgeLabel:  "Instructor",
  },
  student: {
    subtitle:    "Manage your student profile, learning preferences, and account security.",
    badgeColor:  "bg-sky-100 text-sky-800 border-sky-200",
    badgeLabel:  "Student",
  },
  admin: {
    subtitle:    "Platform-wide configuration, user management, and system health controls.",
    badgeColor:  "bg-rose-100 text-rose-800 border-rose-200",
    badgeLabel:  "Admin",
  },
};

// ─── TAB CONFIGS ─────────────────────────────────────────────────────────────
// Each role gets its own ordered tab list. Tabs not in the list are not rendered.

const ROLE_TABS: Record<UserRole, { value: string; icon: React.ElementType; label: string }[]> = {
  instructor: [
    { value: "account",       icon: User,          label: "Account"   },
    { value: "notifications", icon: Bell,          label: "Alerts"    },
    { value: "security",      icon: Shield,        label: "Security"  },
  ],
  student: [
    { value: "account",       icon: User,          label: "Account"   },
    { value: "learning",      icon: GraduationCap, label: "Learning"  },
    { value: "notifications", icon: Bell,          label: "Alerts"    },
    { value: "security",      icon: Shield,        label: "Security"  },
  ],
  admin: [
    { value: "platform",  icon: Server,       label: "Platform"    },
    { value: "users",     icon: Users,        label: "Users"       },
    { value: "security",  icon: Shield,       label: "Security"    },
    { value: "api",       icon: KeyRound,     label: "API & SSO"   },
  ],
};

// ─── Tab content panels ───────────────────────────────────────────────────────

// ── Shared Account ────────────────────────────────────────────────────────────

function AccountTab({ role }: { role: "instructor" | "student" }) {
  const isInstructor = role === "instructor";
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Account Details</CardTitle>
        <CardDescription className="text-muted-foreground">
          {isInstructor
            ? "Manage your name, contact details, and department information."
            : "Manage your name, contact details, and personal preferences."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
              {isInstructor ? "IN" : "ST"}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" className="border-border hover:bg-muted text-foreground">
            <UploadCloud className="w-4 h-4 mr-2" /> Change Avatar
          </Button>
        </div>

        {/* Name fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-foreground">First Name</Label>
            <Input id="firstName" defaultValue={isInstructor ? "Instructor" : "Student"} className="bg-background border-border text-foreground" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
            <Input id="lastName" defaultValue={isInstructor ? "Admin" : "User"} className="bg-background border-border text-foreground" />
          </div>

          {/* Email — read-only */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email" className="text-foreground">Email Address</Label>
            <Input
              id="email"
              defaultValue={isInstructor ? "instructor@tahini.com" : "student@tahini.com"}
              readOnly
              className="bg-muted border-border text-muted-foreground focus-visible:ring-0"
            />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Contact IT support to change your primary institutional email.
            </p>
          </div>

          {/* Role-specific bio field */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio" className="text-foreground">
              {isInstructor ? "Department / Bio" : "About Me"}
            </Label>
            <Textarea
              id="bio"
              placeholder={
                isInstructor
                  ? "e.g. Head of Computer Science"
                  : "e.g. 2nd year Software Engineering student"
              }
              className="bg-background border-border text-foreground"
            />
          </div>

          {/* Student-only: preferred language */}
          {!isInstructor && (
            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground">Preferred Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="max-w-xs bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
      <SaveFooter />
    </Card>
  );
}

// ── Instructor: Notifications ─────────────────────────────────────────────────

function InstructorNotificationsTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Notification Preferences</CardTitle>
        <CardDescription className="text-muted-foreground">
          Choose what events trigger an email or push notification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotifRow
          label="Exam Completion"
          description="Receive an email when all students have submitted an exam."
          defaultChecked
        />
        <NotifRow
          label="Proctoring Anomalies"
          description="Get instant alerts for critical violations during live exams."
          defaultChecked
          destructive
        />
        <NotifRow
          label="Grading Reminders"
          description="Reminders when ungraded submissions are pending review."
          defaultChecked
        />
        <NotifRow
          label="Student Question Posted"
          description="Notified when a student posts a question on your exam."
        />
        <NotifRow
          label="Weekly Digest"
          description="A summary of grading tasks and class performance."
        />
      </CardContent>
    </Card>
  );
}

// ── Student: Learning Preferences ────────────────────────────────────────────

function StudentLearningTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Learning Preferences</CardTitle>
        <CardDescription className="text-muted-foreground">
          Customise how tests and feedback are presented to you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Accessibility */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Accessibility className="h-4 w-4" /> Accessibility
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Increases contrast for easier reading during exams.</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Extended Time Accommodation</Label>
                <p className="text-sm text-muted-foreground">Request extra time. Subject to instructor approval.</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Exam experience */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Sliders className="h-4 w-4" /> Exam Experience
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Show Question Progress Bar</Label>
                <p className="text-sm text-muted-foreground">Display a progress indicator while taking a test.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Confirm Before Submitting</Label>
                <p className="text-sm text-muted-foreground">Show a confirmation dialog before final submission.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Results display */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4" /> Results Display
          </p>
          <div className="space-y-3">
            <div className="space-y-2 max-w-xs">
              <Label className="text-foreground">Default Results View</Label>
              <Select defaultValue="score">
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Score Summary</SelectItem>
                  <SelectItem value="breakdown">Question Breakdown</SelectItem>
                  <SelectItem value="comparison">Class Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <SaveFooter />
    </Card>
  );
}

// ── Student: Notifications ────────────────────────────────────────────────────

function StudentNotificationsTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Notification Preferences</CardTitle>
        <CardDescription className="text-muted-foreground">
          Control which events send you a notification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotifRow
          label="Exam Scheduled"
          description="Notified when an instructor publishes a new exam for you."
          defaultChecked
        />
        <NotifRow
          label="Results Released"
          description="Get notified as soon as your graded results are available."
          defaultChecked
        />
        <NotifRow
          label="Exam Reminder"
          description="Reminder 24 hours before an upcoming exam deadline."
          defaultChecked
        />
        <NotifRow
          label="Instructor Feedback"
          description="Alerts when an instructor leaves feedback on your submission."
          defaultChecked
        />
        <NotifRow
          label="Weekly Performance Summary"
          description="A weekly digest of your practice scores and progress."
        />
      </CardContent>
    </Card>
  );
}

// ── Shared: Security ──────────────────────────────────────────────────────────

function SecurityTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Security & Access</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your password and two-factor authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PasswordBlock />
      </CardContent>
      <CardFooter className="border-t border-border px-6 py-4 justify-between">
        <Button
          variant="outline"
          className="border-border text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Enable 2FA
        </Button>
        <Button className="bg-foreground text-background hover:bg-foreground/90">
          <Save className="w-4 h-4 mr-2" /> Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}

// ── Admin: Platform ───────────────────────────────────────────────────────────

function AdminPlatformTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Platform Configuration</CardTitle>
        <CardDescription className="text-muted-foreground">
          Global settings that apply to all users on the tAhIni platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Branding */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Institution Branding
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground">Institution Name</Label>
              <Input defaultValue="tAhIni University" className="bg-background border-border text-foreground max-w-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground">Platform Logo</Label>
              <Button variant="outline" className="border-border hover:bg-muted text-foreground">
                <UploadCloud className="w-4 h-4 mr-2" /> Upload Logo
              </Button>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Globe className="h-4 w-4" /> Localisation
          </p>
          <div className="grid gap-4 md:grid-cols-2 max-w-xl">
            <div className="space-y-2">
              <Label className="text-foreground">Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Default Timezone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern (EST)</SelectItem>
                  <SelectItem value="cet">Central European (CET)</SelectItem>
                  <SelectItem value="gst">Gulf Standard (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Feature flags */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Sliders className="h-4 w-4" /> Feature Flags
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Live Proctoring</Label>
                <p className="text-sm text-muted-foreground">Enable real-time webcam & activity monitoring for exams.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Practice Mode</Label>
                <p className="text-sm text-muted-foreground">Allow students to attempt ungraded practice tests.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Peer Review</Label>
                <p className="text-sm text-muted-foreground">Enable student-to-student answer review workflows.</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Public Leaderboards</Label>
                <p className="text-sm text-muted-foreground">Show anonymised score rankings on student dashboards.</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </CardContent>
      <SaveFooter label="Save Platform Settings" />
    </Card>
  );
}

// ── Admin: User Management ────────────────────────────────────────────────────

function AdminUsersTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">User Management</CardTitle>
        <CardDescription className="text-muted-foreground">
          Control registration, default roles, and bulk access policies.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Registration policy */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" /> Registration Policy
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Open Registration</Label>
                <p className="text-sm text-muted-foreground">Allow anyone with an institutional email to self-register.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Email Domain Restriction</Label>
                <p className="text-sm text-muted-foreground">Only allow sign-ups from approved email domains.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2 max-w-xl">
              <Label className="text-foreground">Approved Domains</Label>
              <Input
                defaultValue="tahini.com, university.edu"
                placeholder="comma-separated domains"
                className="bg-background border-border text-foreground"
              />
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Separate multiple domains with a comma.
              </p>
            </div>
          </div>
        </div>

        {/* Default role */}
        <div className="space-y-2 max-w-xs">
          <Label className="text-foreground">Default Role on Sign-up</Label>
          <Select defaultValue="student">
            <SelectTrigger className="bg-background border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="instructor">Instructor</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Admins can always promote users after registration.
          </p>
        </div>

        {/* Session policy */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Session Policy
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Force Re-auth on Exam Start</Label>
                <p className="text-sm text-muted-foreground">Require students to re-enter their password when beginning an exam.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2 max-w-xs">
              <Label className="text-foreground">Session Timeout</Label>
              <Select defaultValue="60">
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <SaveFooter label="Save User Policies" />
    </Card>
  );
}

// ── Admin: Security ───────────────────────────────────────────────────────────

function AdminSecurityTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Platform Security</CardTitle>
        <CardDescription className="text-muted-foreground">
          Enforce authentication standards and manage audit logs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* MFA enforcement */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Multi-Factor Authentication</p>
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
            <div className="space-y-0.5">
              <Label className="text-base text-foreground">Require 2FA for Instructors</Label>
              <p className="text-sm text-muted-foreground">All instructor accounts must enrol in 2FA before accessing the platform.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
            <div className="space-y-0.5">
              <Label className="text-base text-foreground">Require 2FA for Admins</Label>
              <p className="text-sm text-muted-foreground">Mandatory for all admin-level accounts. Cannot be disabled.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-rose-200 text-rose-700 bg-rose-50">
                Enforced
              </Badge>
              <Switch defaultChecked disabled />
            </div>
          </div>
        </div>

        {/* Password policy */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Password Policy</p>
          <div className="space-y-3">
            <div className="space-y-2 max-w-xs">
              <Label className="text-foreground">Minimum Password Length</Label>
              <Select defaultValue="12">
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 characters</SelectItem>
                  <SelectItem value="10">10 characters</SelectItem>
                  <SelectItem value="12">12 characters</SelectItem>
                  <SelectItem value="16">16 characters</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Require Special Characters</Label>
                <p className="text-sm text-muted-foreground">Passwords must include at least one special character.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Audit Log</p>
          <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
            <div className="space-y-0.5">
              <Label className="text-base text-foreground">Enable Activity Logging</Label>
              <p className="text-sm text-muted-foreground">Record all login, exam, and admin events for compliance review.</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
      <SaveFooter label="Save Security Settings" />
    </Card>
  );
}

// ── Admin: API & SSO ──────────────────────────────────────────────────────────

function AdminApiTab() {
  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">API & Single Sign-On</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage API keys and configure SSO providers for your institution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* API key */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <KeyRound className="h-4 w-4" /> API Access
          </p>
          <div className="space-y-2 max-w-xl">
            <Label className="text-foreground">Platform API Key</Label>
            <div className="flex gap-2">
              <Input
                defaultValue="sk-tahini-••••••••••••••••••••••••••"
                readOnly
                className="bg-muted border-border text-muted-foreground focus-visible:ring-0 font-mono text-sm"
              />
              <Button variant="outline" className="border-border hover:bg-muted text-foreground shrink-0">
                Regenerate
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Regenerating will immediately invalidate the current key.
            </p>
          </div>
        </div>

        {/* SSO */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Server className="h-4 w-4" /> Single Sign-On (SAML / OIDC)
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Enable SSO</Label>
                <p className="text-sm text-muted-foreground">Allow users to authenticate via your institution's identity provider.</p>
              </div>
              <Switch />
            </div>
            <div className="grid gap-4 md:grid-cols-2 max-w-xl">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-foreground">Identity Provider (IdP) Metadata URL</Label>
                <Input
                  placeholder="https://idp.university.edu/metadata"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">SSO Protocol</Label>
                <Select defaultValue="saml">
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saml">SAML 2.0</SelectItem>
                    <SelectItem value="oidc">OpenID Connect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <SaveFooter label="Save API & SSO Settings" />
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Settings() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Loading settings…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        You must be signed in to view settings.
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
          <p className="text-muted-foreground mt-1 text-sm">{meta.subtitle}</p>
        </div>
        <Badge variant="outline" className={`text-xs px-2 py-0.5 font-medium mt-1 ${meta.badgeColor}`}>
          {meta.badgeLabel}
        </Badge>
      </div>

      {/* Tabs — width adapts to number of tabs */}
      <Tabs defaultValue={tabs[0].value} className="space-y-4">
        <TabsList
          className="grid w-full bg-muted"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`, maxWidth: `${tabs.length * 130}px` }}
        >
          {tabs.map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ── Instructor tabs ── */}
        {role === "instructor" && (
          <>
            <TabsContent value="account">        <AccountTab role="instructor" />       </TabsContent>
            <TabsContent value="notifications">  <InstructorNotificationsTab />         </TabsContent>
            <TabsContent value="security">       <SecurityTab />                        </TabsContent>
          </>
        )}

        {/* ── Student tabs ── */}
        {role === "student" && (
          <>
            <TabsContent value="account">        <AccountTab role="student" />          </TabsContent>
            <TabsContent value="learning">       <StudentLearningTab />                 </TabsContent>
            <TabsContent value="notifications">  <StudentNotificationsTab />            </TabsContent>
            <TabsContent value="security">       <SecurityTab />                        </TabsContent>
          </>
        )}

        {/* ── Admin tabs ── */}
        {role === "admin" && (
          <>
            <TabsContent value="platform">  <AdminPlatformTab />  </TabsContent>
            <TabsContent value="users">     <AdminUsersTab />     </TabsContent>
            <TabsContent value="security">  <AdminSecurityTab />  </TabsContent>
            <TabsContent value="api">       <AdminApiTab />       </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}