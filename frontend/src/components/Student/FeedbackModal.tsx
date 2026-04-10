import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// Updated to accept the submission object from your BrowseTest interface
export interface FeedbackTest {
  id: string;
  title: string;
  subject: string;
  instructorName: string;
  score?: number;
  instructorFeedback?: string; // Root-level feedback
  submission?: {
    totalScore?: number;
    answers?: Array<{
      questionId: string | any;
      status?: string;
      score?: number;
      instructorFeedback?: string; 
    }>;
  };
}

interface FeedbackModalProps {
  test: FeedbackTest | null;
  onClose: () => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-destructive";
}

function getStatusIcon(status?: string, score: number = 0) {
  if (status === "Accepted" || score > 0) {
    return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  }
  if (status === "Pending") {
    return <AlertCircle className="w-4 h-4 text-amber-500" />;
  }
  return <XCircle className="w-4 h-4 text-destructive" />;
}

function getStatusColor(status?: string, score: number = 0) {
  if (status === "Accepted" || score > 0) return "text-emerald-500";
  if (status === "Pending") return "text-amber-500";
  return "text-destructive";
}

export function FeedbackModal({ test, onClose }: FeedbackModalProps) {
  if (!test) return null;

  const answers = test.submission?.answers || [];
  const rootFeedback = test.instructorFeedback || "No overall submission feedback.";

  return (
    <Dialog open={!!test} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-card border-border text-foreground p-0 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* HEADER */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 shrink-0 text-left">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                {test.subject} · {test.instructorName}
              </p>
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                {test.title} Results
              </DialogTitle>
            </div>
            {test.score !== undefined && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Final Score</p>
                <p className={`text-2xl font-bold ${scoreColor(test.score)}`}>
                  {test.score}<span className="text-base text-muted-foreground font-normal"> / 100</span>
                </p>
              </div>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            
            {/* ROOT INSTRUCTOR FEEDBACK (If provided) */}
            {rootFeedback && (
              <div className="p-4 bg-muted/20 border border-border rounded-lg space-y-2">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Overall Instructor Comments</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {rootFeedback}
                </p>
              </div>
            )}

            {/* QUESTION BREAKDOWN TABLE */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Question Breakdown</h3>
              
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50 border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-muted-foreground w-[50px]">#</TableHead>
                      <TableHead className="text-muted-foreground">Question</TableHead>
                      <TableHead className="text-muted-foreground w-[120px]">Status</TableHead>
                      <TableHead className="text-muted-foreground w-[100px] text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {answers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                          No question data available for this submission.
                        </TableCell>
                      </TableRow>
                    )}
                    {answers.map((ans, idx) => {
                      const ansScore = ans.score || 0;
                      // Fallback to "Question X" if the backend didn't populate the question title
                      const qTitle = ans.questionId?.title || `Question ${idx + 1}`; 
                      const statusText = ans.status || (ansScore > 0 ? "Correct" : "Incorrect");

                      return (
                        <TableRow key={idx} className="border-border hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium text-foreground">{idx + 1}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground font-medium">{qTitle}</span>
                              {ans.instructorFeedback && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  <span className="font-semibold">Note:</span> {ans.instructorFeedback}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(ans.status, ansScore)}
                              <span className={`text-sm ${getStatusColor(ans.status, ansScore)}`}>
                                {statusText}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={`text-sm font-semibold ${getStatusColor(ans.status, ansScore)}`}>
                              {ansScore} pts
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}