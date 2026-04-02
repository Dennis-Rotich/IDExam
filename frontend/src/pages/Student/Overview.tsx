import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Clock,
  Play,
  FileText,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Button } from "../../components/ui/button";
// --- MOCK DATA (Personalized & Contextual) ---
const URGENT_ITEMS = [
  {
    id: "u1",
    type: "deadline",
    title: "CS301: Advanced Programming Midterm",
    detail: "Due in 14 hours",
    action: "Start Exam",
    link: "/exam/cs301-mid",
    iconColor: "text-destructive",
    icon: AlertTriangle,
  },
  {
    id: "u2",
    type: "in-progress",
    title: "MTH210: Discrete Math Quiz 3",
    detail: "In Progress (Paused)",
    action: "Resume",
    link: "/exam/mth210-q3",
    iconColor: "text-blue-500",
    icon: Clock,
  },
  {
    id: "u3",
    type: "feedback",
    title: "CS201: Data Structures",
    detail: "New instructor feedback available",
    action: "View",
    link: "/student/results/cs201-mid",
    iconColor: "text-emerald-500",
    icon: Bell,
  },
];

const STATS = {
  avgScore: 84,
  completed: 12,
  totalAssigned: 15,
  upcoming: 3,
  passRate: 92,
};

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
  {
    id: "t3",
    title: "Linear Algebra Final",
    subject: "MTH210",
    instructor: "Dr. Chen",
    daysAway: 14,
    duration: "120m",
    open: false,
  },
];

const RECENT_RESULTS = [
  {
    id: "r1",
    title: "Dynamic Programming Quiz",
    subject: "CS301",
    score: 95,
    passed: true,
    date: "2 days ago",
  },
  {
    id: "r2",
    title: "Binary Trees Evaluation",
    subject: "CS201",
    score: 88,
    passed: true,
    date: "1 week ago",
  },
  {
    id: "r3",
    title: "Physics Lab Safety",
    subject: "PHY101",
    score: 55,
    passed: false,
    date: "2 weeks ago",
  },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-destructive";
}

export function StudentOverview() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto space-y-10 pb-12 text-foreground text-left px-2">
      {/* 1. HEADER & STATS (Flattened) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, John.
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            tAhinI University • BSc Computer Science
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

      {/* 2. URGENT STRIP (No cards, just alert rows) */}
      {URGENT_ITEMS.length > 0 && (
        <div className="space-y-2">
          {URGENT_ITEMS.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 px-4 rounded-md bg-muted/10 border border-border/50 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${item.iconColor}`} />
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
                onClick={() => navigate(`/exam/${item.id}`)}
              >
                <Link to={item.link}>
                  {item.action} <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* 3. SPLIT LAYOUT (Tables instead of Cards) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        {/* LEFT: Upcoming */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
