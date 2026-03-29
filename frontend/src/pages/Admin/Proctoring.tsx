import { useState } from "react";
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Search, 
  ListFilter, Download, Eye, MoreHorizontal, UserCheck, 
  Ban, Shield, Clock, ExternalLink, Activity
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel 
} from "../../components/ui/dropdown-menu";

// --- MOCK DATA ---
type Severity = "Critical" | "Warning" | "Resolved";

interface Incident {
  id: string;
  student: string;
  exam: string;
  instructor: string;
  type: string;
  severity: Severity;
  time: string;
  status: "Needs Review" | "Assigned" | "Dismissed" | "Action Taken";
}

const MOCK_INCIDENTS: Incident[] = [
  { id: "inc-1", student: "Jaylen Brooks", exam: "CS301 Midterm", instructor: "Prof. Velez", type: "Multiple Displays Detected", severity: "Critical", time: "2 mins ago", status: "Needs Review" },
  { id: "inc-2", student: "Marcus Webb", exam: "MTH210 Final", instructor: "Dr. Chen", type: "Secondary Face in Frame", severity: "Critical", time: "15 mins ago", status: "Assigned" },
  { id: "inc-3", student: "Priya Nair", exam: "CS201 Quiz 3", instructor: "Dr. Okonkwo", type: "Tab Switch (x4)", severity: "Warning", time: "32 mins ago", status: "Needs Review" },
  { id: "inc-4", student: "Sarah Chen", exam: "PHY101 Lab", instructor: "Prof. Davis", type: "Audio Threshold Exceeded", severity: "Warning", time: "1 hour ago", status: "Needs Review" },
  { id: "inc-5", student: "David Kim", exam: "CS301 Midterm", instructor: "Prof. Velez", type: "Connection Lost (>2 mins)", severity: "Warning", time: "2 hours ago", status: "Dismissed" },
  { id: "inc-6", student: "Alice K.", exam: "SEC-01 Exam", instructor: "Dr. Smith", type: "Unauthorized Software Blocked", severity: "Resolved", time: "Yesterday", status: "Action Taken" },
  { id: "inc-7", student: "John Doe", exam: "CS101 Midterm", instructor: "Dr. Okonkwo", type: "Tab Switch (x1)", severity: "Resolved", time: "Yesterday", status: "Dismissed" },
];

const PLATFORM_LIVE_STATS = {
  activeExams: 14,
  liveStudents: 892,
  criticalOpen: 2,
  warningsOpen: 5,
};

// --- HELPER FUNCTIONS ---
function getSeverityStyles(severity: Severity) {
  switch (severity) {
    case "Critical": return { color: "text-red-500 dark:text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: ShieldAlert };
    case "Warning": return { color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle };
    case "Resolved": return { color: "text-muted-foreground", bg: "bg-muted/30 border-border", icon: CheckCircle2 };
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Needs Review": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "Assigned": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
}

export function AdminProctoringPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"All" | Severity>("All");

  const filteredIncidents = MOCK_INCIDENTS.filter((inc) => {
    const matchesSearch = inc.student.toLowerCase().includes(searchQuery.toLowerCase()) || inc.exam.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === "All" || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* 1. HEADER & LIVE STATS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Shield className="w-8 h-8 text-muted-foreground" /> Integrity Centre
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor live proctoring flags, review incidents, and enforce academic policy.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-4 pr-6 border-r border-border">
            <Activity className="w-8 h-8 text-emerald-500 opacity-20" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Live Now</p>
              <p className="text-lg font-mono font-medium text-foreground">{PLATFORM_LIVE_STATS.activeExams} Exams <span className="text-muted-foreground mx-1">•</span> {PLATFORM_LIVE_STATS.liveStudents} Users</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5 text-red-500">Critical</p>
              <p className="text-xl font-mono font-bold text-red-500 dark:text-red-400">{PLATFORM_LIVE_STATS.criticalOpen}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-0.5 text-amber-500">Warnings</p>
              <p className="text-xl font-mono font-bold text-amber-500 dark:text-amber-400">{PLATFORM_LIVE_STATS.warningsOpen}</p>
            </div>
          </div>
          <Button variant="outline" className="h-9 rounded-full px-4 text-xs ml-2 border-border text-foreground hover:bg-muted">
            <Download className="w-3.5 h-3.5 mr-2" /> Compliance Report
          </Button>
        </div>
      </div>

      {/* 2. FILTERS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        
        {/* Severity Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {["All", "Critical", "Warning", "Resolved"].map((sev) => {
            const isActive = severityFilter === sev;
            return (
              <Button 
                key={sev} onClick={() => setSeverityFilter(sev as any)} variant={isActive ? "default" : "secondary"}
                className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                  isActive ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {sev}
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search student or exam..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3. INCIDENT QUEUE (Flat List) */}
      <div className="w-full text-sm text-left">
        
        {/* List Header */} 
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-5 shrink-0 text-center">Sev</div>
            <div>Incident Details</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-32 text-left">Exam Context</span>
            <span className="w-28 text-left">Time</span>
            {/* Increased width from w-24 to w-32 */}
            <span className="w-32 text-left">Status</span>
            <div className="w-8 text-right"></div>
          </div>
        </div>

        {/* List Body */}
        <div className="divide-y divide-border/50 border border-border rounded-lg bg-card/10 overflow-hidden">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((inc) => {
              const styles = getSeverityStyles(inc.severity);
              const Icon = styles.icon;

              return (
                <div key={inc.id} className="flex items-center justify-between py-3 px-4 transition-colors bg-transparent hover:bg-muted/30">
                  
                  {/* Left Side: Severity & Details */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-7 h-7 shrink-0 flex justify-center items-center rounded border ${styles.bg} ${styles.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex flex-col min-w-0">
                      <span className="truncate font-medium text-foreground">{inc.type}</span>
                      <span className="text-xs text-muted-foreground truncate mt-0.5">
                        <UserCheck className="w-3 h-3 inline mr-1" />{inc.student}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Context & Actions */}
                  <div className="flex items-center gap-6 shrink-0 pl-4">
                    
                    <div className="hidden md:flex flex-col w-32 text-left min-w-0">
                      <span className="text-xs text-foreground truncate">{inc.exam}</span>
                      <span className="text-[10px] text-muted-foreground truncate mt-0.5">{inc.instructor}</span>
                    </div>
                    
                    <span className="hidden md:flex items-center gap-1.5 w-28 text-left text-muted-foreground text-xs font-mono">
                      <Clock className="w-3.5 h-3.5" /> {inc.time}
                    </span>

                    {/* Increased width from w-24 to w-32 */}
                    <span className="hidden md:flex items-center w-32 text-left">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(inc.status)}`}>
                        {inc.status}
                      </span>
                    </span>
                    
                    <div className="w-8 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                          <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">Triage Action</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Review Evidence
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-border" />
                          
                          <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                            <ExternalLink className="mr-2 h-4 w-4 text-blue-500" /> Assign to {inc.instructor}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" /> Dismiss (False Positive)
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-border" />
                          
                          <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                            <Ban className="mr-2 h-4 w-4" /> Invalidate Exam Submission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Search className="h-8 w-8 mb-3 opacity-20" />
              <p>No proctoring incidents match your criteria.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}