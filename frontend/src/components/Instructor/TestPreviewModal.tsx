import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Clock, Users, FileText, CheckCircle2, CircleDashed, Archive } from "lucide-react";

interface TestPreviewModalProps {
  test: any | null; // Replace 'any' with your Test type
  onClose: () => void;
}

export function TestPreviewModal({ test, onClose }: TestPreviewModalProps) {
  if (!test) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published": return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Published</Badge>;
      case "draft": return <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border"><CircleDashed className="w-3 h-3 mr-1" /> Draft</Badge>;
      case "closed": return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20"><Archive className="w-3 h-3 mr-1" /> Closed</Badge>;
      default: return null;
    }
  };

  return (
    <Dialog open={!!test} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border-border text-foreground p-0 overflow-hidden flex flex-col max-h-[85vh]">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30 shrink-0 text-left">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{test.subject}</p>
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                {test.title}
                {getStatusBadge(test.status)}
              </DialogTitle>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {test.durationMinutes} mins</span>
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {test.questionCount} Questions</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {test.enrolledCount} Enrolled</span>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Question Manifest</h3>
            <div className="border border-border rounded-lg divide-y divide-border">
              {/* Mocking the questions list based on the count */}
              {Array.from({ length: Math.min(test.questionCount, 5) }).map((_, i) => (
                <div key={i} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-xs w-6">{(i + 1).toString().padStart(2, '0')}</span>
                    <span className="text-sm font-medium text-foreground">Sample Question Title {i + 1}</span>
                  </div>
                  <Badge variant="outline" className="bg-transparent border-border text-muted-foreground text-[10px] font-normal">
                    {i % 2 === 0 ? "Code" : "MCQ"}
                  </Badge>
                </div>
              ))}
              {test.questionCount > 5 && (
                <div className="p-3 text-center text-xs text-muted-foreground bg-muted/10">
                  + {test.questionCount - 5} more questions...
                </div>
              )}
              {test.questionCount === 0 && (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No questions added to this test yet.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}