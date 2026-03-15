import {
  AlertTriangle,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";
import { useState } from "react";

// --- DUMMY DATA MATCHING REFERENCE ---
const QUESTION_PERFORMANCE = [
  { id: "Q1", topic: "Big-O notation", type: "MCQ", score: 88 },
  { id: "Q2", topic: "Binary search trees", type: "Code", score: 61 },
  { id: "Q3", topic: "Recursion", type: "Code", score: 58 },
  { id: "Q4", topic: "Hash maps", type: "MCQ", score: 79 },
  { id: "Q5", topic: "Graph traversal", type: "Code", score: 44 },
];

const ALERTS = [
  {
    id: 1,
    type: "warning",
    message: "Jaylen Brooks — tab switch detected (3×) during Q3",
    time: "2:31 PM",
  },
  {
    id: 2,
    type: "critical",
    message: "Priya Nair — accommodation extension request pending",
    time: "2:44 PM",
  },
  {
    id: 3,
    type: "info",
    message: "2 students have not yet opened the exam",
    time: "2:00 PM",
  },
  {
    id: 1,
    type: "warning",
    message: "Jaylen Brooks — tab switch detected (3×) during Q3",
    time: "2:31 PM",
  },
  {
    id: 2,
    type: "critical",
    message: "Priya Nair — accommodation extension request pending",
    time: "2:44 PM",
  },
  {
    id: 3,
    type: "info",
    message: "2 students have not yet opened the exam",
    time: "2:00 PM",
  },
];

const HISTOGRAM_DATA = [
  { label: "<50", count: 1, color: "bg-red-200/80", height: "h-2" },
  { label: "50s", count: 2, color: "bg-amber-200/80", height: "h-6" },
  { label: "60s", count: 5, color: "bg-yellow-200/80", height: "h-16" },
  { label: "70s", count: 9, color: "bg-blue-200/80", height: "h-24" },
  { label: "80s", count: 8, color: "bg-green-200/80", height: "h-20" },
  { label: "90+", count: 4, color: "bg-emerald-200/80", height: "h-12" },
];

// --- HELPER FUNCTIONS ---
const getScoreColor = (score: number) => {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
};

const getProgressBarColor = (score: number) => {
  if (score >= 75) return "bg-emerald-600";
  if (score >= 50) return "bg-amber-700";
  return "bg-red-800";
};

const getAlertStyle = (type: string) => {
  switch (type) {
    case "warning":
      return "bg-amber-50 text-amber-900 border border-amber-200";
    case "critical":
      return "bg-red-50 text-red-900 border border-red-200";
    case "info":
      return "bg-blue-50 text-blue-900 border border-blue-200";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600" />;
    case "critical":
      return <ShieldAlert className="w-4 h-4 mt-0.5 text-red-600" />;
    case "info":
      return <Info className="w-4 h-4 mt-0.5 text-blue-600" />;
    default:
      return null;
  }
};

export function LiveProctoring() {
  const [isAlertsExpanded, setIsAlertsExpanded] = useState(false);
  const displayedAlerts = isAlertsExpanded ? ALERTS : ALERTS.slice(0, 5);
  
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 text-slate-900">
      {/* TOP ROW: Timer & Histogram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TIMER CARD */}
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-slate-600">
              Time remaining
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-5xl font-medium tracking-tight text-[#f5a623]">
                38:12
              </div>
              {/* Progress bar track is now light gray */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#f5a623] w-[60%]" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                90-min window · started 2:00 PM
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-transparent border-slate-300 hover:bg-slate-100 hover:text-black h-8 text-xs px-4"
              >
                + Add time
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 text-xs px-4"
              >
                End exam
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* HISTOGRAM CARD */}
        <Card className="bg-white border-slate-200 shadow-lg md:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle className="text-sm font-normal text-slate-600">
              Score distribution (submitted)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-end h-[180px] pb-1 pt-4">
            <div className="flex items-end justify-between gap-2 h-full mb-4 px-2">
              {HISTOGRAM_DATA.map((bar, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center flex-1 group"
                >
                  <span className="text-[10px] text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.count}
                  </span>
                  <div
                    className={`w-full max-w-[48px] rounded-t-[2px] ${bar.height} ${bar.color} transition-all`}
                  />
                  <span className="text-[10px] text-slate-500 mt-2">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-900 px-2">
              <div>
                <span className="text-slate-600 mr-1">Avg</span>
                <span className="font-semibold">74.2</span>
              </div>
              <div>
                <span className="text-slate-600 mr-1">Median</span>
                <span className="font-semibold">76</span>
              </div>
              <div>
                <span className="text-slate-600 mr-1">High</span>
                <span className="font-semibold">97</span>
              </div>
              <div>
                <span className="text-slate-600 mr-1">Low</span>
                <span className="font-semibold">41</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MIDDLE ROW: Question Performance Table */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-normal text-slate-600">
            Question-level performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="border-slate-200">
              <TableRow className="hover:bg-transparent border-slate-200">
                <TableHead className="text-slate-600 font-normal w-[50px]">
                  #
                </TableHead>
                <TableHead className="text-slate-600 font-normal">
                  Topic
                </TableHead>
                <TableHead className="text-slate-600 font-normal w-[100px]">
                  Type
                </TableHead>
                <TableHead className="text-slate-600 font-normal w-[100px]">
                  Avg score
                </TableHead>
                <TableHead className="text-slate-600 font-normal w-[200px]">
                  Pass rate
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUESTION_PERFORMANCE.map((q) => (
                <TableRow
                  key={q.id}
                  className="border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <TableCell className="text-slate-700 py-3">{q.id}</TableCell>
                  <TableCell className="text-slate-900">{q.topic}</TableCell>
                  <TableCell className="text-slate-700">{q.type}</TableCell>
                  <TableCell
                    className={`${getScoreColor(q.score)} font-medium`}
                  >
                    {q.score}%
                  </TableCell>
                  <TableCell>
                    {/* Progress bar track is now light gray */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getProgressBarColor(q.score)}`}
                        style={{ width: `${q.score}%` }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* BOTTOM ROW: Flags & Alerts */}
      <Card className="bg-white border-slate-200 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-sm font-normal text-slate-600">
            Flags & alerts{" "}
            {ALERTS.length > 5 && (
              <span className="text-slate-400 ml-1">({ALERTS.length})</span>
            )}
          </CardTitle>
          {ALERTS.length > 5 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAlertsExpanded(!isAlertsExpanded)}
              className="h-6 w-6 rounded-full border border-slate-300 hover:bg-slate-100 transition-transform"
            >
              {isAlertsExpanded ? (
                <ChevronUp className="h-3 w-3 text-slate-500" />
              ) : (
                <ChevronDown className="h-3 w-3 text-slate-500" />
              )}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between p-3 rounded-md animate-in fade-in slide-in-from-top-2 duration-200 ${getAlertStyle(alert.type)}`}
              >
                <div className="flex gap-3">
                  {getAlertIcon(alert.type)}
                  <span className="text-sm font-medium tracking-wide opacity-90">
                    {alert.message}
                  </span>
                </div>
                <span className="text-xs opacity-70 mt-0.5">{alert.time}</span>
              </div>
            ))}
          </div>

          {/* Optional: explicit button at bottom to mirror overview style */}
          {ALERTS.length > 5 && !isAlertsExpanded && (
            <Button
              variant="ghost"
              className="w-full mt-4 text-xs text-slate-500 hover:text-slate-800"
              onClick={() => setIsAlertsExpanded(true)}
            >
              View {ALERTS.length - 5} more alerts
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
