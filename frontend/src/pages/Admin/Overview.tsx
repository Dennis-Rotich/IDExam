import { Link } from "react-router-dom";
import { 
  Users, Activity, FileText, ShieldAlert, Server, 
  Terminal, ArrowRight, CheckCircle2, AlertTriangle, 
  Clock, HardDrive, Cpu, Network
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from "recharts";

// --- MOCK DATA ---
const PLATFORM_STATS = {
  users: { total: 14205, students: 13500, instructors: 705, newThisWeek: 124 },
  tests: { published: 842, draft: 156, closed: 3420 },
  activeSessions: 342,
  criticalFlags: 12,
};

const SYSTEM_HEALTH = [
  { name: "CPU Load", usage: 24, icon: Cpu, color: "bg-emerald-500" },
  { name: "Memory (RAM)", usage: 68, icon: Activity, color: "bg-amber-500" },
  { name: "Storage Volume", usage: 42, icon: HardDrive, color: "bg-blue-500" },
  { name: "Network Bandwidth", usage: 18, icon: Network, color: "bg-emerald-500" },
];

const TRAFFIC_DATA = [
  { time: "08:00", logins: 120, submissions: 45 },
  { time: "09:00", logins: 450, submissions: 120 },
  { time: "10:00", logins: 850, submissions: 300 },
  { time: "11:00", logins: 1200, submissions: 550 },
  { time: "12:00", logins: 950, submissions: 800 },
  { time: "13:00", logins: 600, submissions: 950 },
  { time: "14:00", logins: 750, submissions: 400 },
];

const RECENT_ANOMALIES = [
  { id: "fl-1", type: "critical", student: "Jaylen Brooks", exam: "CS301 Midterm", issue: "Multiple displays detected", time: "2 mins ago" },
  { id: "fl-2", type: "warning", student: "Priya Nair", exam: "MTH210 Quiz", issue: "Tab switched (x4)", time: "15 mins ago" },
  { id: "fl-3", type: "critical", student: "Marcus Webb", exam: "CS201 Final", issue: "Secondary face detected", time: "22 mins ago" },
  { id: "fl-4", type: "warning", student: "Sarah Chen", exam: "PHY101 Lab", issue: "Audio threshold exceeded", time: "45 mins ago" },
];

const AUDIT_LOGS = [
  { id: "au-1", action: "ROLE_UPDATE", user: "admin@tahini.com", target: "dr.okonkwo@tahini.com", details: "Promoted to INSTRUCTOR", time: "10:42 AM" },
  { id: "au-2", action: "TEST_DELETED", user: "dr.velez@tahini.com", target: "Exam ID: 8992", details: "Archived 'Intro to Algo'", time: "09:15 AM" },
  { id: "au-3", action: "SYS_CONFIG", user: "admin@tahini.com", target: "Global Settings", details: "Updated SSO SAML Cert", time: "08:30 AM" },
  { id: "au-4", action: "ACCOUNT_SUSPEND", user: "admin@tahini.com", target: "stu_9921@tahini.com", details: "Academic integrity violation", time: "Yesterday" },
  { id: "au-5", action: "BULK_IMPORT", user: "registrar@tahini.com", target: "User Table", details: "Imported 450 new students", time: "Yesterday" },
];

// --- HELPER FUNCTIONS ---
function getAlertStyle(type: string) {
  if (type === "critical") return "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20";
  return "text-amber-600 dark:text-amber-500 bg-amber-500/10 border-amber-500/20";
}

function getAlertIcon(type: string) {
  if (type === "critical") return <ShieldAlert className="w-3.5 h-3.5" />;
  return <AlertTriangle className="w-3.5 h-3.5" />;
}

export function AdminOverview() {
  return (
    <div className="mx-auto space-y-8 pb-12 text-foreground text-left px-2">
      
      {/* 1. HEADER & FLATTENED KPIs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Command Centre</h1>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-normal uppercase tracking-wider text-[10px] px-2 py-0.5">
              <CheckCircle2 className="w-3 h-3 mr-1" /> All Systems Nominal
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Platform-wide health, security alerts, and system analytics.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 text-sm">
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Total Users</p>
            <p className="text-2xl font-mono font-medium text-foreground">{PLATFORM_STATS.users.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Active Sessions</p>
            <p className="text-2xl font-mono font-medium text-emerald-500">{PLATFORM_STATS.activeSessions}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Published Exams</p>
            <p className="text-2xl font-mono font-medium text-foreground">{PLATFORM_STATS.tests.published}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5"/> Active Flags</p>
            <p className={`text-2xl font-mono font-medium ${PLATFORM_STATS.criticalFlags > 0 ? "text-red-500 dark:text-red-400" : "text-emerald-500"}`}>
              {PLATFORM_STATS.criticalFlags}
            </p>
          </div>
        </div>
      </div>

      {/* 2. CHARTS & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Traffic Chart */}
        <div className="lg:col-span-2 border border-border rounded-lg p-5 bg-card/30 flex flex-col h-[320px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Platform Traffic (Today)</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Logins vs Exam Submissions</p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-foreground">View Analytics <ArrowRight className="w-3 h-3 ml-1" /></Button>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="time" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} /><Area type="monotone" dataKey="logins" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLogins)" name="User Logins" strokeWidth={2} />
                <Area type="monotone" dataKey="submissions" stroke="#10b981" fillOpacity={1} fill="url(#colorSubs)" name="Exam Submissions" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Resources */}
        <div className="border border-border rounded-lg bg-card/30 flex flex-col h-[320px]">
          <div className="py-3 px-5 border-b border-border bg-muted/10 flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Infrastructure</h2>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between gap-4">
            {SYSTEM_HEALTH.map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground"><metric.icon className="w-3.5 h-3.5" /> {metric.name}</span>
                  <span className="font-mono font-medium text-foreground">{metric.usage}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. ALERTS & AUDIT LOGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Proctoring Anomalies */}
        <div className="border border-border rounded-lg bg-card/30 flex flex-col overflow-hidden">
          <div className="py-3 px-4 border-b border-border bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <ShieldAlert className="w-4 h-4" /> Proctoring Queue
            </div>
            <Link to="/admin/proctoring" className="text-xs text-blue-500 hover:text-blue-400 font-medium">View All</Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_ANOMALIES.map((alert) => (
              <div key={alert.id} className="p-3 px-4 flex items-center justify-between hover:bg-muted/20 transition-colors bg-transparent">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded border ${getAlertStyle(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-foreground truncate">{alert.student}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.exam} • <span className="text-foreground">{alert.issue}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-[10px] font-mono text-muted-foreground">{alert.time}</span>
                  <Button variant="ghost" size="sm" className="h-7 px-3 text-xs rounded-full border border-border text-foreground hover:bg-muted">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="border border-border rounded-lg bg-card/30 flex flex-col overflow-hidden">
          <div className="py-3 px-4 border-b border-border bg-muted/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <Terminal className="w-4 h-4" /> Live Audit Log
            </div>
            <Link to="/admin/audit" className="text-xs text-blue-500 hover:text-blue-400 font-medium">Full Log</Link>
          </div>
          <div className="divide-y divide-border">
            {AUDIT_LOGS.map((log) => (
              <div key={log.id} className="p-3 px-4 flex items-start gap-4 hover:bg-muted/20 transition-colors bg-transparent">
                <div className="w-20 shrink-0 pt-0.5">
                  <span className="text-[10px] font-mono text-muted-foreground"><Clock className="w-3 h-3 inline mr-1 mb-0.5" />{log.time}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-muted/50 border border-border px-1.5 py-0.5 rounded text-foreground">{log.action}</span>
                    <span className="text-xs font-medium text-foreground truncate">{log.user}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate"><span className="font-medium text-foreground/80">{log.target}:</span> {log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}