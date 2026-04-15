import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle2, XCircle, AlertCircle, MessageSquare, Loader2
} from "lucide-react";
import { Button } from "../../components/ui/button";
// Ensure this import path matches your project structure
import { getStudentSubmissionApi } from "../../api/submission"; 

// Helper function for the status icons
function getStatusIcon(status: string) {
  if (status === "passed") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-destructive" />;
  return <AlertCircle className="w-4 h-4 text-amber-500" />;
}

export function StudentSubmissionDetail() {
  const { submissionId } = useParams<{ submissionId: string }>();
  
  const [submission, setSubmission] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchSubmissionDetails = async () => {
      if (!submissionId) return;
      try {
        setIsLoading(true);
        const res: any = await getStudentSubmissionApi(submissionId);
        
        // FIX: Extract the actual submission object from the wrapper
        const actualSubmission = res.submission || res.data?.submission || res;
        setSubmission(actualSubmission);
        
      } catch (err: any) {
        console.error("Failed to load submission details", err);
        setError("Could not load the submission. It may not exist or you don't have permission to view it.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [submissionId]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-destructive opacity-80" />
        <h2 className="text-xl font-bold text-foreground">Submission Not Found</h2>
        <p className="text-sm text-muted-foreground">{error}</p>
        <Link to="/student/results">
          <Button variant="outline" className="mt-4">Back to Results</Button>
        </Link>
      </div>
    );
  }

  // --- DYNAMIC CALCULATIONS ---
  const exam = submission.exam || {};
  
  // 1. Calculate overall score percentage
  const totalPossiblePoints = exam.totalPoints || exam.questions?.reduce((acc: number, q: any) => acc + (q.pointsWeight || 0), 0) || 100;
  const scorePercentage = Math.round(((submission.totalScore || 0) / totalPossiblePoints) * 100);

  // 2. Calculate time spent
  let timeSpentStr = "N/A";
  if (submission.startedAt && submission.submittedAt) {
    const start = new Date(submission.startedAt).getTime();
    const end = new Date(submission.submittedAt).getTime();
    const minutes = Math.max(1, Math.round((end - start) / 60000));
    timeSpentStr = `${minutes} mins`;
  }

  return (  
    <div className="mx-auto space-y-8 pb-12 text-foreground text-left px-2 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-start gap-4 pb-6 border-b border-border">
        <Link to="/student/results">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted rounded-full shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
              {exam.courseCode || exam.subject || "General"} • {new Date(submission.submittedAt || submission.updatedAt).toLocaleDateString()}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{exam.title || "Assessment"}</h1>
            <p className="text-sm text-muted-foreground mt-1">Instructor: {exam.creator?.name || exam.createdBy?.name || "Unknown"}</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Time Spent</p>
              <p className="font-mono">{timeSpentStr} <span className="text-muted-foreground text-xs">/ {exam.durationInMinutes}m</span></p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Raw Score</p>
              <p className="font-mono">{submission.totalScore || 0} <span className="text-muted-foreground text-xs">/ {totalPossiblePoints}</span></p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Grade</p>
              <p className={`text-2xl font-mono font-medium ${submission.passed || scorePercentage >= 50 ? 'text-emerald-500' : 'text-destructive'}`}>
                {scorePercentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION BREAKDOWN (Flat List Style) */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Submission Breakdown</h2>
        
        <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
          {submission.answers?.map((ans: any, idx: number) => {
            const q = ans.questionId || {};
            const maxScore = q.pointsWeight || 0;
            const score = ans.score || 0;
            
            // Determine dynamic status
            let status = "failed";
            if (score === maxScore && maxScore > 0) status = "passed";
            else if (score > 0) status = "partial";
            
            // For coding questions, look for ans.code. Otherwise ans.answer
            const studentOutput = ans.code || ans.answer || "No answer provided.";

            return (
              <div key={ans._id || idx} className="flex flex-col bg-card/50">
                
                {/* Question Header */}
                <div className="p-4 bg-muted/10 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getStatusIcon(status)}</div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <span>{idx + 1}.</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                          {q.type?.replace("_", " ") || "Question"}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-2 leading-relaxed max-w-3xl whitespace-pre-wrap">
                        {q.description || q.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground shrink-0">{score} / {maxScore} pts</div>
                </div>
                
                {/* Answer Area */}
                <div className="p-4 flex flex-col xl:flex-row gap-6">
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Output</p>
                    {q.type === "CODING" || !q.type ? (
                      <div className="bg-[#1e1e1e] border border-border rounded-md p-4 overflow-x-auto max-h-96">
                        <pre className="text-sm font-mono text-[#d4d4d4]"><code>{studentOutput}</code></pre>
                      </div>
                    ) : (
                      <div className="bg-background border border-border rounded-md p-3 text-sm text-foreground">{studentOutput}</div>
                    )}
                  </div>

                  {/* Expected Answer (if provided by the backend) */}
                  {q.correctAnswer && (
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expected</p>
                      {q.type === "CODING" || !q.type ? (
                        <div className="bg-[#1e1e1e] border border-border rounded-md p-4 overflow-x-auto max-h-96">
                          <pre className="text-sm font-mono text-emerald-500"><code>{q.correctAnswer}</code></pre>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-md p-3 text-sm text-emerald-600 dark:text-emerald-400">
                          {q.correctAnswer}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Test Cases / Execution Results (Specific to Coding Questions) */}
                {ans.testResults && ans.testResults.length > 0 && (
                  <div className="px-4 pb-4">
                    <div className="border border-border rounded-md overflow-hidden bg-background">
                      <div className="bg-muted/30 px-3 py-1.5 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
                        Execution Logs
                      </div>
                      <div className="divide-y divide-border">
                        {ans.testResults.map((tc: any, tcIdx: number) => (
                          <div key={tcIdx} className="p-3 text-sm flex items-start gap-3">
                            <div className="mt-0.5">{tc.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-destructive" />}</div>
                            <div className="flex-1 font-mono text-xs text-muted-foreground">
                              Got: <span className={tc.passed ? "text-emerald-500" : "text-destructive"}>{tc.actualOutput || tc.errorMessage || "No output"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Area */}
                {ans.feedback && (
                  <div className="px-4 pb-4">
                    <div className="border border-blue-500/20 bg-blue-500/5 rounded-md p-4 flex gap-3">
                      <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Instructor Note</p>
                        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{ans.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}