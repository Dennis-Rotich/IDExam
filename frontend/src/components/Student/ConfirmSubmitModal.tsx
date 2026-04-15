import { AlertTriangle, Send } from "lucide-react";
import { Button } from "../../components/ui/button";

interface ExamStats {
  total: number;
  attempted: number;
  unattempted: number;
}

interface ConfirmSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stats: ExamStats;
}

export function ConfirmSubmitModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  stats 
}: ConfirmSubmitModalProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Submit Exam?</h3>
          <p className="text-sm text-muted-foreground mt-2">
            You are about to finalize your exam. Once submitted, you cannot return to edit your answers.
          </p>
        </div>

        <div className="bg-muted/30 rounded-lg border border-border p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Questions</span>
            <span className="font-medium text-foreground">{stats.total}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Answered</span>
            <span className="font-medium text-emerald-500">{stats.attempted}</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-3 border-t border-border">
            <span className="text-muted-foreground font-medium">Unanswered</span>
            <span className={`font-bold ${stats.unattempted > 0 ? "text-destructive" : "text-foreground"}`}>
              {stats.unattempted}
            </span>
          </div>
        </div>

        {stats.unattempted > 0 && (
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded mb-6 text-center border border-destructive/20 font-medium">
            Warning: You have {stats.unattempted} unanswered question(s).
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onClose}
          >
            Return to Exam
          </Button>
          <Button 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onConfirm}
          >
            <Send className="w-4 h-4 mr-2" /> Submit Now
          </Button>
        </div>
        
      </div>
    </div>
  );
}