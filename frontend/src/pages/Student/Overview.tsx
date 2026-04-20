import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Clock, Play, FileText, ChevronRight, Loader2 } from "lucide-react";
import { scoreColor } from "../../utils/string";
import { Button } from "../../components/ui/button";
// Ensure this API is exported in your api/exam.ts file
import { getAssignedExamsApi } from "../../api/exam";

export function StudentOverview() {
  const navigate = useNavigate();

  // Cleaned up state: only examsData and isLoading are needed
  const [examsData, setExamsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Only one API call needed now! Your backend handles the joins.
        const res = await getAssignedExamsApi();
        setExamsData(res || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- DYNAMIC CALCULATIONS USING YOUR BACKEND PAYLOAD ---

  // 1. Urgent Items (In-Progress)
  const URGENT_ITEMS = examsData
    .filter((exam) => exam.inProgress)
    .map((exam) => ({
      id: exam.id,
      title: exam.title,
      detail: "In Progress (Paused)",
      action: "Resume",
      link: `/exam/${exam.id}`,
      iconColor: "text-blue-500",
      icon: Clock,
    }));

  // 2. Upcoming / Available Exams
  const upcomingTests = examsData
    .filter(
      (exam) =>
        exam.availability === "available" || exam.availability === "upcoming",
    )
    .map((exam) => {
      const now = new Date();
      const fromDate = new Date(exam.availableFrom);
      const timeDiff = fromDate.getTime() - now.getTime();
      const daysAway =
        timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 3600 * 24)) : 0;

      return {
        id: exam.id,
        title: exam.title,
        subject: exam.subject || "General",
        instructor: exam.instructorName,
        daysAway: daysAway,
        duration: `${exam.durationMinutes}m`,
        open: exam.availability === "available",
      };
    });

  // 3. Recent Results (Completed)
  const RECENT_RESULTS = examsData
    .filter((exam) => exam.availability === "completed")
    // If you add an updatedAt field to your backend payload later, you can sort by it here
    .slice(0, 5)
    .map((exam) => ({
      id: exam.submission?._id || exam.id,
      title: exam.title,
      subject: exam.subject || "General",
      score: exam.score || 0,
      passed: exam.submission?.passed || false, // Assumes submission object has 'passed'
      date: exam.submission?.submittedAt
        ? new Date(exam.submission.submittedAt).toLocaleDateString()
        : "Recently",
    }));

  // 4. Calculate Stats
  const gradedExams = examsData.filter(
    (exam) => exam.score !== null && exam.score !== undefined,
  );
  const totalScore = gradedExams.reduce((acc, curr) => acc + curr.score, 0);
  const avgScore =
    gradedExams.length > 0 ? Math.round(totalScore / gradedExams.length) : 0;

  // Assumes pass mark is roughly 50% if not explicitly provided, adjust as needed
  const passedCount = gradedExams.filter(
    (exam) => exam.submission?.passed || exam.score >= 50,
  ).length;
  const passRate =
    gradedExams.length > 0
      ? Math.round((passedCount / gradedExams.length) * 100)
      : 0;

  const STATS = {
    avgScore,
    completed: examsData.filter((e) => e.availability === "completed").length,
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
        {/* LEFT: Upcoming Exams */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Upcoming Deadlines
            </h2>
            <Link
              to="/student/exams"
              className="text-xs text-blue-500 hover:text-blue-400"
            >
              View All
            </Link>
          </div>
          <div className="space-y-1">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center justify-between py-3 px-2 hover:bg-muted/10 rounded-md transition-colors"
              >
                <div className="min-w-0 pr-4">
                  <p className="text-sm font-medium text-foreground truncate">
                    {test.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {test.subject} •{" "}
                    {test.daysAway > 0
                      ? `Opens in ${test.daysAway} days`
                      : "Currently Open"}
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
            {upcomingTests.length === 0 && (
              <p className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded-md">
                No upcoming exams assigned to you.
              </p>
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
              <p className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded-md">
                No recent results found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
