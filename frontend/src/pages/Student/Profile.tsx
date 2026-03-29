import { Link } from "react-router-dom";
import { 
  ArrowLeft, Edit2, GraduationCap, BookOpen, Clock, 
  CheckCircle2, AlertCircle, BarChart2, Award, TrendingUp 
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";

// --- MOCK DATA ---
const STUDENT_INFO = {
  name: "Jaylen Brooks",
  id: "STU-2024-8991",
  programme: "BSc Computer Science, Year 2",
  institution: "tAhIni University",
  joined: "September 2024",
  bio: "Passionate about backend development and distributed systems. Currently learning Go and advanced graph algorithms.",
};

const ACADEMIC_RECORD = {
  avgScore: 82.4,
  testsTaken: 14,
  testsAssigned: 15,
  passRate: "92%",
  strongest: "Data Structures (94%)",
  weakest: "Computer Architecture (68%)",
};

const ENROLLMENTS = [
  { id: "CS201", name: "Data Structures & Algorithms", instructor: "Dr. Sarah Okonkwo", status: "Active" },
  { id: "CS301", name: "Advanced Programming", instructor: "Prof. James Velez", status: "Active" },
  { id: "MTH210", name: "Discrete Mathematics", instructor: "Dr. Alan Chen", status: "Active" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "feedback", title: "New Feedback: Midterm", course: "CS201", time: "2 hours ago", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 2, type: "completed", title: "Completed: Quiz 3", course: "CS201", time: "Yesterday", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 3, type: "upcoming", title: "Upcoming: Final Exam", course: "MTH210", time: "In 3 days", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 4, type: "achievement", title: "Perfect Score: Quiz 2", course: "CS301", time: "1 week ago", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const SCORE_TREND = [
  { name: "Quiz 1", score: 75 },
  { name: "Quiz 2", score: 82 },
  { name: "Midterm", score: 78 },
  { name: "Assign 1", score: 90 },
  { name: "Quiz 3", score: 88 },
  { name: "Project", score: 95 },
  { name: "Quiz 4", score: 85 },
];

export function StudentProfilePage() {
  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link to="/student">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl bg-muted text-muted-foreground">JB</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-foreground">
                {STUDENT_INFO.name}
                <Badge variant="outline" className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 font-normal text-xs">
                  Student
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {STUDENT_INFO.id} • {STUDENT_INFO.programme}
              </p>
            </div>
          </div>
        </div>
        <Link to="/student/settings">
          <Button variant="outline" className="border-border hover:bg-muted text-foreground h-9">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </Link>
      </div>

      {/* --- KPI DASHBOARD ROW --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Average</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{ACADEMIC_RECORD.avgScore}%</div>
            <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> +2.4% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {ACADEMIC_RECORD.testsTaken} <span className="text-lg text-muted-foreground font-medium">/ {ACADEMIC_RECORD.testsAssigned}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">Tests completed this semester</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{ACADEMIC_RECORD.passRate}</div>
            <p className="text-xs text-muted-foreground pt-1">Across all graded submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Strongest Subject</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-foreground leading-tight truncate">{ACADEMIC_RECORD.strongest}</div>
            <p className="text-xs text-muted-foreground pt-1 truncate">Weakest: {ACADEMIC_RECORD.weakest}</p>
          </CardContent>
        </Card>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Identity & Enrollment */}
        <div className="space-y-6 lg:col-span-1">
          {/* Bio Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="py-4 border-b border-border bg-muted/30">
              <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">About</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Institution</p>
                <p className="text-sm text-foreground">{STUDENT_INFO.institution}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Joined</p>
                <p className="text-sm text-foreground">{STUDENT_INFO.joined}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Bio</p>
                <p className="text-sm text-foreground leading-relaxed">{STUDENT_INFO.bio}</p>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="py-4 border-b border-border bg-muted/30">
              <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">Current Enrollment</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {ENROLLMENTS.map((course) => (
                  <div key={course.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-foreground">{course.id}</p>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">{course.status}</Badge>
                    </div>
                    <p className="text-sm text-foreground line-clamp-1">{course.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> {course.instructor}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Chart & Activity */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Score Trend Chart */}
          <Card className="bg-card border-border shadow-sm flex flex-col">
            <CardHeader className="py-4 border-b border-border bg-muted/30 flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">Performance Trend</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Scores across your last {SCORE_TREND.length} submissions.</p>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2 pl-0">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SCORE_TREND} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}%`}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px", color: "var(--foreground)" }}
                      itemStyle={{ color: "var(--foreground)", fontWeight: 500 }}
                      cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "3 3" }}
                    />
                    <ReferenceLine y={ACADEMIC_RECORD.avgScore} stroke="#888888" strokeDasharray="3 3" opacity={0.5} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" /* A clean blue that works in dark/light mode */
                      strokeWidth={2}
                      dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: "#3b82f6", stroke: "var(--background)", strokeWidth: 2 }}
                      name="Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lightweight Activity Feed */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="py-4 border-b border-border bg-muted/30">
              <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[230px]">
                <div className="divide-y divide-border">
                  {RECENT_ACTIVITY.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors">
                        <div className={`p-2 rounded-full shrink-0 mt-0.5 ${activity.bg} ${activity.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground leading-snug">{activity.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.course}</p>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                          {activity.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}