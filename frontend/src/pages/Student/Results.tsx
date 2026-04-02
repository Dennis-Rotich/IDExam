import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, BarChart2, TrendingUp, CheckCircle2, 
  XCircle, Filter, ChevronRight, Calendar, FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";

// --- MOCK DATA ---
const KPI_DATA = {
  overallAverage: 84.5,
  testsCompleted: 14,
  passRate: 92,
  highestScore: { score: 98, test: "Data Structures Midterm" },
};

const SCORE_TREND = [
  { name: "Sep", score: 75 },
  { name: "Oct", score: 82 },
  { name: "Nov", score: 78 },
  { name: "Dec", score: 90 },
  { name: "Jan", score: 88 },
  { name: "Feb", score: 95 },
  { name: "Mar", score: 85 },
];

const SUBJECT_PERFORMANCE = [
  { subject: "CS201", average: 88, max: 100 },
  { subject: "CS301", average: 76, max: 100 },
  { subject: "MTH210", average: 92, max: 100 },
  { subject: "PHY101", average: 68, max: 100 },
];

const TEST_HISTORY = [
  { id: "att-1", title: "Midterm: Data Structures", subject: "CS201", date: "2026-03-10", score: 98, passed: true, timeSpent: "85m" },
  { id: "att-2", title: "Quiz 3 — Binary Trees", subject: "CS201", date: "2026-02-28", score: 85, passed: true, timeSpent: "28m" },
  { id: "att-3", title: "Intro to Algorithms — Quiz 1", subject: "CS301", date: "2026-02-14", score: 72, passed: true, timeSpent: "45m" },
  { id: "att-4", title: "Linear Algebra Final", subject: "MTH210", date: "2026-01-20", score: 92, passed: true, timeSpent: "110m" },
  { id: "att-5", title: "Physics Lab Safety Quiz", subject: "PHY101", date: "2025-11-05", score: 55, passed: false, timeSpent: "15m" },
  { id: "att-6", title: "Graph Theory Assessment", subject: "CS301", date: "2025-10-12", score: 88, passed: true, timeSpent: "50m" },
];

// --- HELPER FUNCTIONS ---
function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-destructive";
}

function getStatusIcon(score: number, passed: boolean) {
  if (!passed || score < 60) return <XCircle className="w-4 h-4 text-destructive" />;
  if (score >= 80) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  return <AlertCircle className="w-4 h-4 text-amber-500" />;
}

export function StudentResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filteredHistory = TEST_HISTORY.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="mx-auto space-y-10 pb-12 text-foreground text-left px-2">
      
      {/* 1. HEADER & FLATTENED KPIs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart2 className="h-7 w-7" /> Performance & Results
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your academic progress and analyze your strengths.</p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5"/> Overall Avg</p><p className={`text-2xl font-mono font-bold ${scoreColor(KPI_DATA.overallAverage)}`}>{KPI_DATA.overallAverage}%</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Pass Rate</p><p className="text-2xl font-mono font-medium text-foreground">{KPI_DATA.passRate}%</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Completed</p><p className="text-2xl font-mono font-medium text-foreground">{KPI_DATA.testsCompleted}</p></div>
        </div>
      </div>

      {/* 2. CHARTS ROW (Clean borders, no heavy headers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Score Trend Chart */}
        <div className="border border-border rounded-lg p-5 bg-card/50 flex flex-col">
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Score Trend Over Time</h2>
            <p className="text-xs text-muted-foreground mt-1">Your performance trajectory for the academic year.</p>
          </div>
          <div className="h-[220px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SCORE_TREND} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", color: "var(--foreground)" }}
                  itemStyle={{ color: "var(--foreground)", fontWeight: 500 }}
                  cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
                <ReferenceLine y={KPI_DATA.overallAverage} stroke="#888888" strokeDasharray="3 3" opacity={0.5} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#3b82f6", stroke: "var(--background)", strokeWidth: 2 }} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance Bar Chart */}
        <div className="border border-border rounded-lg p-5 bg-card/50 flex flex-col">
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Average by Subject</h2>
            <p className="text-xs text-muted-foreground mt-1">Identify your strongest and weakest modules.</p>
          </div>
          <div className="h-[220px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUBJECT_PERFORMANCE} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <YAxis dataKey="subject" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", color: "var(--foreground)" }} />
                <Bar dataKey="average" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Avg Score" barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. TEST HISTORY SECTION */}
      <div className="space-y-4">
        
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Submission History</h2>
            <p className="text-xs text-muted-foreground mt-1">A complete record of all your graded assessments.</p>
          </div>
          
          <div className="flex w-full sm:w-auto gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tests..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-transparent hover:bg-muted/50 transition-colors text-sm rounded-full">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Subject" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="CS201">CS201</SelectItem>
                <SelectItem value="CS301">CS301</SelectItem>
                <SelectItem value="MTH210">MTH210</SelectItem>
                <SelectItem value="PHY101">PHY101</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* List Layout */}
        <div className="w-full text-sm">
          <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
            <div className="flex justify-between gap-1">
            <div className="">Status</div>
            <div>Title & Subject</div>
          </div>
            <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
              <span className="w-24 text-left">Date Taken</span>
              <span className="w-16 text-right">Score</span>
              <div className="w-24 text-right">Action</div>
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            filteredHistory.map((test, idx) => (
              <div key={test.id} className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}>
                
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-5 shrink-0 flex justify-center">
                    {getStatusIcon(test.score, test.passed)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-foreground">{test.title}</span>
                    <span className="text-xs text-muted-foreground">{test.subject} • {test.timeSpent} spent</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0 pl-4">
                  <span className="hidden md:flex items-center gap-1.5 w-24 text-left text-muted-foreground text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(test.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <span className={`hidden md:inline-block w-16 text-right font-mono font-bold ${scoreColor(test.score)}`}>
                    {test.score}%
                  </span>
                  
                  <div className="w-24 flex justify-end">
                    <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
                      <Link to={`/student/results/${test.id}`}>Review <ChevronRight className="w-3 h-3 ml-1" /></Link>
                    </Button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Search className="h-8 w-8 mb-3 opacity-20" />
              <p>No results found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}