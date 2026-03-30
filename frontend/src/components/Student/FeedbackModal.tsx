import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

// We extract just the fields we need from the test object to keep the modal loosely coupled
export interface FeedbackTest {
  id: string;
  title: string;
  subject: string;
  instructorName: string;
  score?: number;
}

interface FeedbackModalProps {
  test: FeedbackTest | null;
  onClose: () => void;
}

// Dummy data for the feedback modal
const MOCK_FEEDBACK = [
  { id: "q1", number: 1, title: "Binary Search Implementation", status: "passed", autoScore: 20, maxScore: 20, feedback: "Great use of pointers." },
  { id: "q2", number: 2, title: "Graph Cycle Detection", status: "partial", autoScore: 10, maxScore: 25, feedback: "You forgot to remove the node from the visited set after the recursive call returns." },
  { id: "q3", number: 3, title: "Dynamic Programming Knapsack", status: "failed", autoScore: 0, maxScore: 30, feedback: "Logic error in the tabulation step." },
];

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-destructive";
}

export function FeedbackModal({ test, onClose }: FeedbackModalProps) {
  if (!test) return null;

  return (
    <Dialog open={!!test} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-card border-border text-foreground p-0 overflow-hidden flex flex-col max-h-[85vh] p-9">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30 shrink-0 text-left">
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
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Question Breakdown & Feedback</h3>
            
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50 border-b border-border">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-muted-foreground w-[50px]">#</TableHead>
                    <TableHead className="text-muted-foreground">Question</TableHead>
                    <TableHead className="text-muted-foreground w-[100px] text-right">Score</TableHead>
                    <TableHead className="text-muted-foreground">Instructor Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_FEEDBACK.map((q) => (
                    <TableRow key={q.id} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-foreground">{q.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {q.status === 'passed' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : 
                           q.status === 'failed' ? <XCircle className="w-4 h-4 text-destructive" /> : 
                           <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                          <span className="text-sm text-foreground">{q.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`text-sm font-semibold ${
                          q.status === 'passed' ? 'text-emerald-500' : 
                          q.status === 'failed' ? 'text-destructive' : 'text-amber-500'
                        }`}>
                          {q.autoScore}/{q.maxScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{q.feedback}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}