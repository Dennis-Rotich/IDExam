import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Clock,
  Play,
  FileText,
  ChevronRight,
  Loader2
} from "lucide-react";
import { scoreColor } from "../../utils/string";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { getStudentSubmissionsApi } from "../../api/submission";
// Adjust import path to match your types location
import { type SubmissionResponse } from "../../types/submission";

// --- MOCK DATA (Requires an /exam endpoint, NOT a /submission endpoint) ---
const UPCOMING_TESTS = [
  {
    id: "t1",
    title: "Advanced Programming Midterm",
    subject: "CS301",
    instructor: "Prof. Velez",
    daysAway: 0.5,
    duration: "90m",
    open: true,
  },
  {
    id: "t2",
    title: "Graph Algorithms Assessment",
    subject: "CS201",
    instructor: "Dr. Okonkwo",
    daysAway: 3,
    duration: "60m",
    open: true,
  },
];

export function StudentOverview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State for dynamic data
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Assumes your API returns { success: true, data: [...] }
        const res = await getStudentSubmissionsApi(1, 10);
        // @ts-ignore - adjust based on your exact SubmissionsListResponse shape
        setSubmissions(res.data || []); 
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- DYNAMIC CALCULATIONS ---
  
  // 1. Filter Submissions
  const inProgressSubmissions = submissions.filter(s => s.status === 'in-progress');
  const completedSubmissions = submissions.filter(s => s.status === 'submitted' || s.status === 'graded');
  const gradedSubmissions = submissions.filter(s => s.status === 'graded');

  // 2. Map Urgent Items (In-Progress)
  const URGENT_ITEMS = inProgressSubmissions.map(sub => ({
    id: sub._id,
    type: "in-progress",
    title: sub.exam?.title || "Active Exam",
    detail: "In Progress (Paused)",
    action: "Resume",
    link: `/exam/${sub.exam?._id || sub.exam}`,
    iconColor: "text-blue-500",
    icon: Clock,
  }));

  // 3. Map Recent Results
  const RECENT_RESULTS = completedSubmissions
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5) // Keep it to the latest 5
    .map(sub => ({
      id: sub._id,
      title: sub.exam?.title || "Completed Exam",
      subject: sub.exam?.subject || "General",
      score: sub.totalScore || 0,
      passed: sub.passed || false,
      date: new Date(sub.updatedAt).toLocaleDateString(),
    }));

  // 4. Calculate Stats
  const totalGradedScore = gradedSubmissions.reduce((acc, curr) => acc + (curr.totalScore || 0), 0);
  const avgScore = gradedSubmissions.length > 0 ? Math.round(totalGradedScore / gradedSubmissions.length) : 0;
  
  const passedCount = gradedSubmissions.filter(s => s.passed).length;
  const passRate = gradedSubmissions.length > 0 ? Math.round((passedCount / gradedSubmissions.length) * 100) : 0;

  const STATS = {
    avgScore,
    completed: completedSubmissions.length,
    passRate,
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-10 pb-12 text-foreground text-left px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <p className="text-muted-foreground mt-1 text-sm">
            {user?.institution || "tAhinI University"} • {user?.role === "student" ? "Student Portal" : ""}
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Avg Score</p>
            <p className="text-2xl font-mono font-medium text-foreground">
              {STATS.avgScore}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-mono font-medium text-foreground">
              {STATS.completed}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Pass Rate</p>
            <p className="text-2xl font-mono font-medium text-emerald-500">
              {STATS.passRate}%
            </p>
          </div>
        </div>
      </div>

      {/* 2. URGENT STRIP */}
      {URGENT_ITEMS.length > 0 && (
        <div className="space-y-2">
          {URGENT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 px-4 rounded-md bg-muted/10 border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 dark:text-white text-black`} />
                <span className="font-medium text-sm text-foreground">
                  {item.title}
                </span>
                <span className="hidden sm:inline-block text-xs text-muted-foreground border-l border-border pl-3">
                  {item.detail}
                </span>
              </div>
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="h-8 text-xs hover:bg-background"
                onClick={() => navigate(item.link)}
              >
                <Link to={item.link}>
                  {item.action} <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 3. SPLIT LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* LEFT: Upcoming (Still Mocked) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Upcoming Deadlines
            </h2>
            <Link
              to="/student/tests"
              className="text-xs text-blue-500 hover:text-blue-400"
            >
              View All
            </Link>
          </div>
          <div className="space-y-1">
            {UPCOMING_TESTS.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between py-3 px-2 hover:bg-muted/10 rounded-md transition-colors"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-medium text-foreground truncate">
                    {test.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {test.subject} • Due in {test.daysAway} days
                  </p>
                </div>
                {test.open ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs bg-muted/50 hover:bg-muted text-foreground shrink-0 rounded-full px-4"
                    onClick={() => navigate(`/exam/${test.id}`)}
                  >
                    <Play className="w-3 h-3 mr-1.5" /> Start
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground/50 shrink-0 pr-2">
                    Locked
                  </span>
                )}
              </div>
            ))}
            {UPCOMING_TESTS.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded-md">No upcoming exams.</p>
            )}
          </div>
        </div>

        {/* RIGHT: Recent Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Submissions
            </h2>
            <Link
              to="/student/results"
              className="text-xs text-blue-500 hover:text-blue-400"
            >
              Full History
            </Link>
          </div>
          <div className="space-y-1">
            {RECENT_RESULTS.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between py-3 px-2 hover:bg-muted/10 rounded-md transition-colors"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-medium text-foreground truncate">
                    {res.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {res.subject} • {res.date}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`font-mono font-bold ${scoreColor(res.score)}`}
                  >
                    {res.score}%
                  </span>
                  <Link to={`/student/results/${res.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {RECENT_RESULTS.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded-md">No recent results found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}