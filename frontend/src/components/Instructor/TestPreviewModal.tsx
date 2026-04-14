import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Clock, 
  Users, 
  FileText, 
  CheckCircle2, 
  CircleDashed, 
  Archive,
  Calendar,
  ShieldAlert,
  Code2,
  Type,
  List
} from "lucide-react";

interface TestPreviewModalProps {
  test: any | null; 
  onClose: () => void;
}

export function TestPreviewModal({ test, onClose }: TestPreviewModalProps) {
  if (!test) return null;

  const getStatus = () => {
    if (!test.isActive) return "draft";
    const now = new Date();
    if (new Date(test.availableUntil) < now) return "closed";
    return "published";
  };

  const status = getStatus();

  const getStatusBadge = (currentStatus: string) => {
    switch (currentStatus) {
      case "published": return <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
      case "draft": return <Badge variant="outline" className="text-muted-foreground"><CircleDashed className="w-3 h-3 mr-1" /> Draft</Badge>;
      case "closed": return <Badge variant="outline" className="text-amber-600 dark:text-amber-500"><Archive className="w-3 h-3 mr-1" /> Closed</Badge>;
      default: return null;
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case "CODING": return <Badge variant="secondary" className="text-[10px]"><Code2 className="w-3 h-3 mr-1"/> Code</Badge>;
      case "SHORT_ANSWER": return <Badge variant="outline" className="text-[10px]"><Type className="w-3 h-3 mr-1"/> Text</Badge>;
      case "MULTIPLE_CHOICE": return <Badge variant="outline" className="text-[10px]"><List className="w-3 h-3 mr-1"/> MCQ</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{type}</Badge>;
    }
  };

  const questionsList = Array.isArray(test.questions) ? test.questions : [];
  const totalPoints = questionsList.reduce((sum: number, q: any) => sum + (q.pointsWeight || 0), 0);
  const cohortsList = Array.isArray(test.assignedCohorts) ? test.assignedCohorts : [];

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
    });
  };

  return (
    <Dialog open={!!test} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border-border text-foreground p-0 flex flex-col max-h-[85vh]">
        
        {/* HEADER SECTION */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-muted/30 shrink-0 text-left">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-bold text-primary tracking-wider">{test.courseCode || "NO CODE"}</p>
                <span className="text-muted-foreground text-xs">•</span>
                <p className="text-xs font-medium text-muted-foreground tracking-wider">{test.examCode || "NO EXAM ID"}</p>
              </div>
              <DialogTitle className="text-xl font-bold flex items-center gap-3 mt-1">
                {test.title}
                {getStatusBadge(status)}
              </DialogTitle>
            </div>
          </div>
          
          <div className="flex items-center gap-5 mt-5 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5 text-foreground"><Clock className="w-4 h-4 text-primary" /> {test.durationInMinutes || 0} mins</span>
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {questionsList.length} Questions ({totalPoints} Pts)</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {cohortsList.length} Cohorts Assigned</span>
          </div>
        </DialogHeader>

        {/* FIX: Explicit max-height to force ScrollArea boundary */}
        <ScrollArea className="h-[calc(85vh-140px)] w-full overflow-hidden">
          <div className="space-y-6 px-6 py-4">
            
            {/* EXAM SETTINGS GRID */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Availability Window</span>
                <p className="text-sm font-medium">
                  {formatDate(test.availableFrom)} <span className="text-muted-foreground mx-1">→</span> {formatDate(test.availableUntil)}
                </p>
              </div>
              <div className="space-y-1 p-3 bg-muted/20 border border-border rounded-lg">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><ShieldAlert className="w-3 h-3"/> Engine Security</span>
                <div className="flex gap-2 mt-1">
                  {test.aiProctoringEnabled ? 
                    <Badge variant="secondary" className="text-blue-600 dark:text-blue-400 text-[10px]">AI Proctored</Badge> : 
                    <Badge variant="outline" className="text-[10px]">Unproctored</Badge>
                  }
                  {test.aiGradingEnabled && <Badge variant="secondary" className="text-purple-600 dark:text-purple-400 text-[10px]">Auto-Grading</Badge>}
                </div>
              </div>
            </div>

            {/* INSTRUCTIONS PREVIEW */}
            {test.instructions && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Candidate Instructions</h3>
                <div className="p-3 bg-muted/30 border border-border rounded-lg text-sm text-foreground whitespace-pre-wrap font-sans">
                  {test.instructions}
                </div>
              </div>
            )}

            {/* QUESTION MANIFEST */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Question Manifest</h3>
              <div className="border border-border rounded-lg divide-y divide-border bg-card">
                
                {questionsList.length > 0 ? (
                  questionsList.map((q: any, i: number) => (
                    <div key={q._id || i} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-muted-foreground font-mono text-xs w-6 shrink-0">{(i + 1).toString().padStart(2, '0')}</span>
                        <div className="truncate">
                          <p className="text-sm font-medium text-foreground truncate">{q.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{q.tags?.join(", ") || "No tags"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-xs font-medium text-muted-foreground">{q.pointsWeight} pts</span>
                        {getQuestionTypeIcon(q.type)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
                    <FileText className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No questions loaded.</p>
                    <p className="text-xs">This test might be empty or questions weren't populated in the API.</p>
                  </div>
                )}
                
              </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}