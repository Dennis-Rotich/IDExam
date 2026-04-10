import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Award,
  Loader2,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// --- HOOKS & APIs ---
import { useAuth } from "../../context/AuthContext";
import { useStudentResults } from "../../hooks/useStudentResults";
import { getAssignedExamsApi } from "../../api/exam";
import { getInitials } from "../../utils/string";

export function StudentProfilePage() {
  // 1. Get the currently logged-in student
  const { user } = useAuth();

  // 2. Pull the heavy math from the Results hook
  const {
    isLoading: isResultsLoading,
    KPI_DATA,
    SCORE_TREND,
    SUBJECT_PERFORMANCE,
    TEST_HISTORY,
  } = useStudentResults();

  // 3. State for Active Enrollments
  const [assignedExamsCount, setAssignedExamsCount] = useState(0);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isExamsLoading, setIsExamsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setIsExamsLoading(true);
        // Fetches exams assigned to the logged-in student
        const exams = await getAssignedExamsApi();
        setAssignedExamsCount(exams.length);

        // Derive "Enrollments" (Active Subjects) from the assigned exams
        const subjectsMap = new Map();
        exams.forEach((exam) => {
          if (!subjectsMap.has(exam.subject)) {
            subjectsMap.set(exam.subject, {
              id: exam.subject,
              name: `${exam.subject} Module`, // Fallback name
              instructor: exam.instructorName,
              status: "Active",
            });
          }
        });
        setEnrollments(Array.from(subjectsMap.values()));
      } catch (error) {
        console.error("Failed to load assigned exams for profile", error);
      } finally {
        setIsExamsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  // --- DYNAMIC DATA MAPPING ---

  const strongestSubject =
    SUBJECT_PERFORMANCE.length > 0
      ? `${SUBJECT_PERFORMANCE[0].subject} (${SUBJECT_PERFORMANCE[0].average}%)`
      : "Not enough data";

  const weakestSubject =
    SUBJECT_PERFORMANCE.length > 0
      ? `${SUBJECT_PERFORMANCE[SUBJECT_PERFORMANCE.length - 1].subject} (${SUBJECT_PERFORMANCE[SUBJECT_PERFORMANCE.length - 1].average}%)`
      : "Not enough data";

  // Map the top 4 recent submissions into the Activity Feed format
  const RECENT_ACTIVITY = TEST_HISTORY.slice(0, 4).map((test, index) => {
    const isPassed = test.passed;
    const isPending = test.status === "submitted";

    return {
      id: test.id || index,
      title: isPending
        ? `Submitted: ${test.title}`
        : isPassed
          ? `Passed: ${test.title}`
          : `Reviewed: ${test.title}`,
      course: test.subject,
      time: new Date(test.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      icon: isPending ? Clock : isPassed ? CheckCircle2 : AlertCircle,
      color: isPending
        ? "text-blue-500"
        : isPassed
          ? "text-emerald-500"
          : "text-amber-500",
      bg: isPending
        ? "bg-blue-500/10"
        : isPassed
          ? "bg-emerald-500/10"
          : "bg-amber-500/10",
    };
  });

  const isLoading = isResultsLoading || isExamsLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link to="/student">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3 text-foreground">
                {user?.name || "Student"}
                <Badge
                  variant="outline"
                  className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 font-normal text-xs capitalize"
                >
                  {user?.role || "Student"}
                </Badge>
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user?.studentId || "ID Not Set"} •{" "}
                {user?.institution || "tAhIni University"}
              </p>
            </div>
          </div>
        </div>
        <Link to="/student/settings">
          <Button
            variant="outline"
            className="border-border hover:bg-muted text-foreground h-9"
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
        </Link>
      </div>

      {/* --- KPI DASHBOARD ROW --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Average
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {KPI_DATA.overallAverage}%
            </div>
            <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
              Based on graded submissions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {KPI_DATA.testsCompleted}{" "}
              <span className="text-lg text-muted-foreground font-medium">
                / {assignedExamsCount}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Tests completed this semester
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pass Rate
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {KPI_DATA.passRate}%
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Across all graded submissions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Strongest Subject
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-lg font-bold text-foreground leading-tight truncate"
              title={strongestSubject}
            >
              {strongestSubject}
            </div>
            <p
              className="text-xs text-muted-foreground pt-1 truncate"
              title={`Weakest: ${weakestSubject}`}
            >
              Weakest: {weakestSubject}
            </p>
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
              <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">
                About
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Institution
                </p>
                <p className="text-sm text-foreground">
                  {user?.institution || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  Email
                </p>
                <p className="text-sm text-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Card */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="py-4 border-b border-border bg-muted/30">
              <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">
                Active Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {enrollments.length > 0 ? (
                  enrollments.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-foreground">
                          {course.id}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        >
                          {course.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground line-clamp-1">
                        {course.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> {course.instructor}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No active enrollments found.
                  </div>
                )}
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
                <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">
                  Performance Trend
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Scores across your graded submissions.
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-2 pl-0">
              <div className="h-[250px] w-full">
                {SCORE_TREND.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={SCORE_TREND}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--border)"
                        opacity={0.5}
                      />
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
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "6px",
                          color: "var(--foreground)",
                        }}
                        itemStyle={{
                          color: "var(--foreground)",
                          fontWeight: 500,
                        }}
                        cursor={{
                          stroke: "var(--muted-foreground)",
                          strokeWidth: 1,
                          strokeDasharray: "3 3",
                        }}
                      />
                      <ReferenceLine
                        y={KPI_DATA.overallAverage}
                        stroke="#888888"
                        strokeDasharray="3 3"
                        opacity={0.5}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }}
                        activeDot={{
                          r: 6,
                          fill: "#3b82f6",
                          stroke: "var(--background)",
                          strokeWidth: 2,
                        }}
                        name="Score"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-lg mx-6 mb-6">
                    Not enough graded data yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lightweight Activity Feed */}
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="py-4 border-b border-border bg-muted/30">
              <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[230px]">
                <div className="divide-y divide-border">
                  {RECENT_ACTIVITY.length > 0 ? (
                    RECENT_ACTIVITY.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={activity.id}
                          className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
                        >
                          <div
                            className={`p-2 rounded-full shrink-0 mt-0.5 ${activity.bg} ${activity.color}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {activity.course}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                            {activity.time}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No recent activity found.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
