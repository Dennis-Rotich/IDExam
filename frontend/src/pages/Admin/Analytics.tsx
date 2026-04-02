import { Download, TrendingUp, Users, BookOpen, GraduationCap, BarChart2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area 
} from "recharts";

// --- MOCK DATA ---
const PASS_FAIL_TREND = [
  { month: "Sep", pass: 82, fail: 18 }, { month: "Oct", pass: 85, fail: 15 },
  { month: "Nov", pass: 80, fail: 20 }, { month: "Dec", pass: 88, fail: 12 },
  { month: "Jan", pass: 84, fail: 16 }, { month: "Feb", pass: 91, fail: 9 },
  { month: "Mar", pass: 89, fail: 11 },
];

const SCORE_DISTRIBUTION = [
  { range: "0-50", count: 45 }, { range: "51-60", count: 120 },
  { range: "61-70", count: 350 }, { range: "71-80", count: 890 },
  { range: "81-90", count: 1240 }, { range: "91-100", count: 650 },
];

const TOP_COURSES = [
  { id: "CS301", name: "Advanced Programming", instructor: "Prof. Velez", avg: 76, students: 450 },
  { id: "CS201", name: "Data Structures", instructor: "Dr. Okonkwo", avg: 82, students: 512 },
  { id: "MTH210", name: "Discrete Math", instructor: "Dr. Chen", avg: 71, students: 380 },
  { id: "PHY101", name: "Physics I", instructor: "Prof. Davis", avg: 65, students: 620 },
];

export function AdminAnalyticsPage() {
  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-muted-foreground" /> Platform Analytics
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Institution-wide performance, engagement, and outcome metrics.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select defaultValue="spring2026">
            <SelectTrigger className="w-[160px] h-9 bg-background border-border text-sm rounded-full">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spring2026">Spring 2026</SelectItem>
              <SelectItem value="fall2025">Fall 2025</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5 text-sm shrink-0">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Institution Avg Score", value: "78.4%", icon: TrendingUp },
          { label: "Active Enrollments", value: "14,205", icon: Users },
          { label: "Exams Conducted", value: "3,420", icon: BookOpen },
          { label: "Completion Rate", value: "94.2%", icon: GraduationCap },
        ].map((kpi, i) => (
          <div key={i} className="p-4 border border-border rounded-lg bg-card/30 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-2xl font-mono font-medium text-foreground">{kpi.value}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded border border-border/50"><kpi.icon className="w-4 h-4 text-muted-foreground" /></div>
          </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pass/Fail Trend */}
        <div className="border border-border rounded-lg p-5 bg-card/30 flex flex-col h-[350px]">
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Pass vs Fail Trend</h2>
            <p className="text-xs text-muted-foreground mt-1">Monthly progression of overall completion status.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PASS_FAIL_TREND} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                <Area type="monotone" dataKey="pass" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Pass Rate" />
                <Area type="monotone" dataKey="fail" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Fail Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="border border-border rounded-lg p-5 bg-card/30 flex flex-col h-[350px]">
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Global Score Distribution</h2>
            <p className="text-xs text-muted-foreground mt-1">Aggregated results across all disciplines.</p>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SCORE_DISTRIBUTION} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="range" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* TOP COURSES TABLE (Flat List) */}
      <div className="border border-border rounded-lg bg-card/30 overflow-hidden">
        <div className="py-3 px-5 border-b border-border bg-muted/10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Course Performance Overview</h2>
        </div>
        <div className="w-full text-sm">
          <div className="flex items-center justify-between py-2 px-5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
            <div className="flex-1 min-w-0">Course Code & Name</div>
            <div className="w-48 text-left">Instructor</div>
            <div className="w-24 text-right">Students</div>
            <div className="w-24 text-right">Avg Score</div>
          </div>
          <div className="divide-y divide-border/50">
            {TOP_COURSES.map((course) => (
              <div key={course.id} className="flex items-center justify-between py-3 px-5 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="font-mono text-xs bg-muted/50 border border-border px-1.5 py-0.5 rounded">{course.id}</span>
                  <span className="font-medium truncate">{course.name}</span>
                </div>
                <div className="w-48 text-left text-muted-foreground truncate">{course.instructor}</div>
                <div className="w-24 text-right font-mono">{course.students}</div>
                <div className={`w-24 text-right font-mono font-bold ${course.avg >= 75 ? 'text-emerald-500' : 'text-amber-500'}`}>{course.avg}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}