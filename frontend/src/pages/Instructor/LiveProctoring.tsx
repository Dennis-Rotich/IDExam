import { useState } from "react";
import { AlertTriangle, Info, ShieldAlert, ChevronDown, ChevronUp, Clock, BarChart2, Activity, Bell } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../components/ui/alert-dialog";

const QUESTION_PERFORMANCE = [
  { id: "Q1", topic: "Big-O notation", type: "MCQ", score: 88 },
  { id: "Q2", topic: "Binary search trees", type: "Code", score: 61 },
  { id: "Q3", topic: "Recursion", type: "Code", score: 58 },
  { id: "Q4", topic: "Hash maps", type: "MCQ", score: 79 },
  { id: "Q5", topic: "Graph traversal", type: "Code", score: 44 },
];

const ALERTS = [
  { id: 1, type: "warning", message: "Jaylen Brooks — tab switch detected (3×)", time: "2:31 PM" },
  { id: 2, type: "critical", message: "Priya Nair — extension request pending", time: "2:44 PM" },
  { id: 3, type: "info", message: "2 students have not yet opened the exam", time: "2:00 PM" },
  { id: 4, type: "warning", message: "Jaylen Brooks — tab switch detected (3×)", time: "2:31 PM" },
  { id: 5, type: "critical", message: "Priya Nair — extension request pending", time: "2:44 PM" },
  { id: 6, type: "info", message: "2 students have not yet opened the exam", time: "2:00 PM" },
];

const HISTOGRAM_DATA = [
  { label: "<50", count: 1, color: "bg-destructive/50", height: "h-2" },
  { label: "50s", count: 2, color: "bg-amber-500/40", height: "h-6" },
  { label: "60s", count: 5, color: "bg-amber-500/40", height: "h-16" },
  { label: "70s", count: 9, color: "bg-blue-500/40", height: "h-24" },
  { label: "80s", count: 8, color: "bg-emerald-500/40", height: "h-20" },
  { label: "90+", count: 4, color: "bg-emerald-500/60", height: "h-12" },
];

const getScoreColor = (score: number) => {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
};

const getProgressBarColor = (score: number) => {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-destructive";
};

const getAlertStyle = (type: string) => {
  switch (type) {
    case "warning": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "critical": return "bg-destructive/10 text-red-500 border-destructive/20";
    case "info": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning": return <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-500" />;
    case "critical": return <ShieldAlert className="w-4 h-4 mt-0.5 text-red-500" />;
    case "info": return <Info className="w-4 h-4 mt-0.5 text-blue-500" />;
    default: return null;
  }
};

export function LiveProctoring() {
  const [isAlertsExpanded, setIsAlertsExpanded] = useState(false);
  const displayedAlerts = isAlertsExpanded ? ALERTS : ALERTS.slice(0, 5);
  
  // Interactive States
  const [addedMinutes, setAddedMinutes] = useState(0);
  const [isExamEnded, setIsExamEnded] = useState(false);
  
  // Modal Controls
  const [isAddTimerOpen, setIsAddTimerOpen] = useState(false);
  const [isEndExamOpen, setIsEndExamOpen] = useState(false);
  const [timeToAdd, setTimeToAdd] = useState("15");

  const handleAddTimeSubmit = () => {
    const mins = parseInt(timeToAdd);
    if (!isNaN(mins) && mins > 0) setAddedMinutes((prev) => prev + mins);
    setIsAddTimerOpen(false);
    setTimeToAdd("15");
  };

  const handleEndExamSubmit = () => {
    setIsExamEnded(true);
    setIsEndExamOpen(false);
  };

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="h-7 w-7" /> Live Proctoring
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">CS201 Midterm Examination • 87 Students Active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setIsAddTimerOpen(true)}
            disabled={isExamEnded}
            className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5 text-sm"
          >
            + Add Time
          </Button>
          <Button 
            onClick={() => setIsEndExamOpen(true)}
            disabled={isExamEnded}
            className="bg-destructive/10 text-red-500 hover:bg-destructive/20 h-9 rounded-full px-5 text-sm font-medium border border-destructive/20"
          >
            End Exam
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TIMER BLOCK */}
        <div className="border border-border rounded-lg bg-card/30 overflow-hidden flex flex-col">
          <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> Time Remaining
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <div className={`text-5xl font-mono font-medium tracking-tight ${isExamEnded ? "text-red-500" : "text-[#f5a623]"}`}>
              {isExamEnded ? "00:00" : `${38 + addedMinutes}:12`}
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full mt-4 overflow-hidden">
              <div 
                className={`h-full ${isExamEnded ? "bg-destructive w-full" : "bg-[#f5a623] w-[60%]"}`} 
                style={!isExamEnded ? { width: `${Math.min(100, 60 + (addedMinutes * 0.5))}%` } : {}}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3 font-medium">
              {90 + addedMinutes}-min window · started 2:00 PM
            </p>
          </div>
        </div>

        {/* HISTOGRAM BLOCK */}
        <div className="lg:col-span-2 border border-border rounded-lg bg-card/30 overflow-hidden flex flex-col">
          <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5" /> Score Distribution
          </div>
          <div className="p-6 flex flex-col justify-end h-[180px] flex-1">
            <div className="flex items-end justify-between gap-2 h-full mb-4 px-2">
              {HISTOGRAM_DATA.map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  <span className="text-[10px] text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{bar.count}</span>
                  <div className={`w-full max-w-[48px] rounded-t-[2px] ${bar.height} ${bar.color} transition-all`} />
                  <span className="text-[10px] text-muted-foreground mt-2">{bar.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground px-2 pt-2 border-t border-border/50">
              <div>Avg: <span className="font-mono font-semibold text-foreground">74.2</span></div>
              <div>Median: <span className="font-mono font-semibold text-foreground">76</span></div>
              <div>High: <span className="font-mono font-semibold text-foreground">97</span></div>
              <div>Low: <span className="font-mono font-semibold text-foreground">41</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* QUESTION PERFORMANCE LIST */}
        <div className="border border-border rounded-lg bg-card/30 overflow-hidden flex flex-col">
          <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Question-Level Performance
          </div>
          
          <div className="w-full text-sm">
            <div className="flex items-center justify-between py-2 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <div className="w-8">#</div>
              <div className="flex-1">Topic</div>
              <div className="w-16">Type</div>
              <div className="w-16 text-right">Avg</div>
              <div className="w-24 pl-4">Pass Rate</div>
            </div>

            {QUESTION_PERFORMANCE.map((q, idx) => (
              <div key={q.id} className={`flex items-center justify-between py-3 px-4 transition-colors ${idx % 2 === 0 ? "bg-muted/5" : "bg-transparent"} hover:bg-muted/30`}>
                <div className="w-8 text-muted-foreground text-xs font-mono">{q.id}</div>
                <div className="flex-1 font-medium text-foreground truncate">{q.topic}</div>
                <div className="w-16 text-muted-foreground text-xs">{q.type}</div>
                <div className={`w-16 text-right font-mono font-bold ${getScoreColor(q.score)}`}>{q.score}%</div>
                <div className="w-24 pl-4 flex items-center">
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${getProgressBarColor(q.score)}`} style={{ width: `${q.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS & FLAGS */}
        <div className="border border-border rounded-lg bg-card/30 overflow-hidden flex flex-col">
          <div className="py-2.5 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between items-center">
            <span className="flex items-center gap-2"><Bell className="w-3.5 h-3.5" /> Flags & Alerts</span>
            <span className="bg-destructive/10 text-red-500 px-2 py-0.5 rounded-full">{ALERTS.length} New</span>
          </div>
          
          <div className="p-2 space-y-2 flex-1 overflow-y-auto">
            {displayedAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-start justify-between p-3 rounded-md border ${getAlertStyle(alert.type)} bg-background/50`}>
                <div className="flex gap-3 min-w-0">
                  <div className="shrink-0">{getAlertIcon(alert.type)}</div>
                  <span className="text-sm font-medium tracking-wide truncate">{alert.message}</span>
                </div>
                <span className="text-[10px] text-red font-mono mt-0.5 shrink-0 pl-2">{alert.time}</span>
              </div>
            ))}
            
            {ALERTS.length > 5 && !isAlertsExpanded && (
              <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md" onClick={() => setIsAlertsExpanded(true)}>
                View {ALERTS.length - 5} more alerts <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            )}
            {isAlertsExpanded && (
              <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md" onClick={() => setIsAlertsExpanded(false)}>
                Show less <ChevronUp className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>

      </div>

      {/* Add Time Dialog */}
      <Dialog open={isAddTimerOpen} onOpenChange={setIsAddTimerOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border bg-muted/10">
            <DialogTitle className="text-lg">Extend Exam Time</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Enter the number of minutes to extend the exam for all active students.
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minutes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Minutes to add</Label>
              <Input
                id="minutes" type="number" min="1"
                value={timeToAdd} onChange={(e) => setTimeToAdd(e.target.value)}
                className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md"
              />
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/5">
            <Button variant="secondary" onClick={() => setIsAddTimerOpen(false)} className="rounded-full px-5 h-8 text-xs bg-muted/50 hover:bg-muted text-foreground">
              Cancel
            </Button>
            <Button onClick={handleAddTimeSubmit} className="rounded-full px-5 h-8 text-xs bg-foreground text-background hover:bg-foreground/90">
              Apply Extension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Exam Alert Dialog */}
      <AlertDialog open={isEndExamOpen} onOpenChange={setIsEndExamOpen}>
        <AlertDialogContent className="bg-card border-border text-foreground p-0 overflow-hidden sm:max-w-[425px]">
          <AlertDialogHeader className="px-6 py-4 border-b border-border bg-destructive/5">
            <AlertDialogTitle className="text-lg text-red-500 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" /> Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground mt-1">
              This action cannot be undone. This will immediately terminate the exam for all active students and force-submit their current progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="px-6 py-4 bg-muted/5">
            <AlertDialogCancel className="rounded-full px-5 h-8 text-xs border-border hover:bg-muted text-foreground mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleEndExamSubmit} className="rounded-full px-5 h-8 text-xs bg-destructive/60 text-slate-200 hover:bg-destructive/90">
              Yes, end exam now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}