import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Users,
  TrendingUp,
  Loader2,
  Download
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { getExamSubmissionsApi } from "../../api/exam"; // Adjust the import path if necessary
import { type Submission } from "../../types/submission";

export default function ExamSubmissionsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // State Management
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Data on Mount
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!examId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getExamSubmissionsApi(examId);

        const data = (response as any).data || response;
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(
          err.message || "Failed to load submissions. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [examId]);

  // UI Helpers
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "graded":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Graded
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertCircle className="w-3 h-3 mr-1" /> Needs Review
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Clock className="w-3 h-3 mr-1" /> In Progress
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="capitalize">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  // Derived Metrics
  const totalParticipants = submissions.length;
  const completedSubmissions = submissions.filter(
    (s) => s.status !== "in-progress",
  );
  const pendingReview = submissions.filter(
    (s) => s.status === "submitted",
  ).length;

  // NEW: Calculate how many passed based on the dynamic passMark
  const passedCount = completedSubmissions.filter((sub) => {
    // Fallback to 50 if somehow undefined, just to be safe
    const requiredToPass = sub.exam?.passMark ?? 50;
    return (sub.totalScore || 0) >= requiredToPass;
  }).length;

  const passRate =
    completedSubmissions.length > 0
      ? Math.round((passedCount / completedSubmissions.length) * 100)
      : 0;

  const averageScore =
    completedSubmissions.length > 0
      ? (
          completedSubmissions.reduce(
            (acc, curr) => acc + (curr.totalScore || 0),
            0,
          ) / completedSubmissions.length
        ).toFixed(1)
      : "0.0";

  const completionRate =
    totalParticipants > 0
      ? Math.round((completedSubmissions.length / totalParticipants) * 100)
      : 0;

  // Search Filter
  const filteredSubmissions = submissions.filter((sub) => {
    const studentName = sub.student?.name || "";
    const studentReg = sub.student?.studentId || "";
    return (
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentReg.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          Fetching student submissions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block">
          <AlertCircle className="w-6 h-6 mx-auto mb-2" />
          <p className="font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (submissions.length === 0) return;

    // 1. Define headers
    const headers = [
      "Student Name",
      "Student ID",
      "Status",
      "Total Score",
      "Pass Mark",
      "Passed",
      "Time Spent (mins)",
      "Submitted At",
    ];

    // 2. Map submissions to rows
    const csvRows = submissions.map((sub) => {
      const name = sub.student?.name || "Unknown";
      const id = sub.student?.studentId || sub.student?.email || "N/A";
      const status = sub.status;
      const score = sub.totalScore || 0;
      const passMark = sub.exam?.passMark ?? 50;
      const passed = score >= passMark ? "YES" : "NO";

      const timeSpent =
        sub.startedAt && sub.submittedAt
          ? Math.round(
              (new Date(sub.submittedAt).getTime() -
                new Date(sub.startedAt).getTime()) /
                60000,
            )
          : "N/A";
      const submittedTime = sub.submittedAt
        ? new Date(sub.submittedAt).toLocaleString()
        : "N/A";

      // Wrap strings in quotes to prevent comma injection issues in CSV
      return `"${name}","${id}","${status}",${score},${passMark},"${passed}",${timeSpent},"${submittedTime}"`;
    });

    // 3. Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. Trigger browser download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Exam_${examId}_Submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Exam Submissions
            </h1>
            {/* You can pass the exam title via state/URL params if you want this to be dynamic */}
            <p className="text-muted-foreground text-sm">Exam ID: {examId}</p>
          </div>
        </div>
        <Button variant="secondary" className="gap-2" onClick={handleExportCSV}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Started sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedSubmissions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{passRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {passedCount} students passed
              </p>
            </CardContent>
          </Card>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Points achieved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReview}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Require manual grading
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Section */}
      <Card>
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/20">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or ID..."
              className="pl-8 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter Status
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Score</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No submissions found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((sub) => (
                <TableRow key={sub._id}>
                  <TableCell>
                    <div className="font-medium">
                      {sub.student?.name || "Unknown Student"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {sub.student?.studentId || sub.student?.email || "No ID"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(sub.status)}</TableCell>
                  <TableCell>
                    {sub.status === "in-progress" ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <span className="font-medium">
                        {sub.totalScore || 0} pts
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {/* Calculate time spent dynamically using startedAt and submittedAt */}
                    {sub.startedAt && sub.submittedAt
                      ? `${Math.round((new Date(sub.submittedAt).getTime() - new Date(sub.startedAt).getTime()) / 60000)} mins`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {sub.submittedAt
                      ? new Date(sub.submittedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate(`/instructor/submission/${sub._id}`)
                      }
                      disabled={sub.status === "in-progress"}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
