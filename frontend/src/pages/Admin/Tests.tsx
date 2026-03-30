import { useState } from "react";
import { 
  Search, ListFilter, MoreHorizontal, Eye, 
  Ban, ShieldAlert, CheckCircle2, CircleDashed, 
  Archive, AlertTriangle, Clock, Users, FileText,
  CalendarClock
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel
} from "../../components/ui/dropdown-menu";

// --- MOCK DATA ---
type TestStatus = "Published" | "Draft" | "Closed" | "Flagged";

interface AdminTestRecord {
  id: string;
  title: string;
  course: string;
  instructor: string;
  status: TestStatus;
  enrolled: number;
  submitted: number;
  dueDate: string;
  flagReason?: string;
}

const MOCK_TESTS: AdminTestRecord[] = [
  { id: "t1", title: "Data Structures Midterm", course: "CS201", instructor: "Dr. Sarah Okonkwo", status: "Published", enrolled: 120, submitted: 45, dueDate: "Tomorrow" },
  { id: "t2", title: "Advanced Algorithms", course: "CS301", instructor: "Prof. James Velez", status: "Published", enrolled: 85, submitted: 85, dueDate: "In 3 days" },
  { id: "t3", title: "Intro to Python Quiz", course: "CS101", instructor: "Dr. Alan Chen", status: "Closed", enrolled: 210, submitted: 205, dueDate: "Last Week" },
  { id: "t4", title: "Database Systems Final", course: "DB401", instructor: "Prof. Emily Davis", status: "Flagged", enrolled: 150, submitted: 0, dueDate: "Next Month", flagReason: "Contains unapproved third-party links" },
  { id: "t5", title: "Discrete Math Quiz 1", course: "MTH210", instructor: "Dr. Sarah Okonkwo", status: "Draft", enrolled: 0, submitted: 0, dueDate: "TBD" },
  { id: "t6", title: "System Architecture", course: "CS350", instructor: "Prof. James Velez", status: "Published", enrolled: 95, submitted: 12, dueDate: "Today" },
];

const OVERVIEW_STATS = {
  total: 842,
  active: 312,
  flagged: 4,
  avgSubmissions: "84%"
};

// --- HELPER FUNCTIONS ---
function getStatusStyles(status: TestStatus) {
  switch (status) {
    case "Published": return { color: "text-emerald-500 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 };
    case "Closed": return { color: "text-amber-500 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: Archive };
    case "Flagged": return { color: "text-red-500 dark:text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: ShieldAlert };
    case "Draft": return { color: "text-muted-foreground", bg: "bg-muted/50 border-border", icon: CircleDashed };
  }
}

export function AdminTestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TestStatus>("All");

  const filteredTests = MOCK_TESTS.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* 1. HEADER & KPIs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Oversight</h1>
          <p className="text-muted-foreground mt-1 text-sm">Platform-wide visibility into all examinations and instructor assessments.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 text-sm">
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Total Tests</p>
            <p className="text-2xl font-mono font-medium text-foreground">{OVERVIEW_STATS.total}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Active / Published</p>
            <p className="text-2xl font-mono font-medium text-emerald-500">{OVERVIEW_STATS.active}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5"/> Policy Flags</p>
            <p className={`text-2xl font-mono font-medium ${OVERVIEW_STATS.flagged > 0 ? "text-red-500 dark:text-red-400" : "text-emerald-500"}`}>
              {OVERVIEW_STATS.flagged}
            </p>
          </div>
        </div>
      </div>

      {/* 2. FILTERS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {["All", "Published", "Draft", "Closed", "Flagged"].map((status) => {
            const isActive = statusFilter === status;
            return (
              <Button 
                key={status} onClick={() => setStatusFilter(status as any)} variant={isActive ? "default" : "secondary"}
                className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                  isActive ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {status}
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search test, course, or instructor..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3. TESTS LIST */}
      <div className="w-full text-sm">
        
        {/* List Header */}
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 border-b border-border/50 pb-3">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-6 shrink-0 text-center">Stat</div>
            <div>Test Title & Instructor</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-24 text-left">Engagement</span>
            <span className="w-24 text-left">Timeline</span>
            <div className="w-8 text-right"></div>
          </div>
        </div>

        {/* List Body */}
        {filteredTests.length > 0 ? (
          filteredTests.map((test, idx) => {
            const styles = getStatusStyles(test.status);
            const StatusIcon = styles.icon;
            const completionRate = test.enrolled > 0 ? Math.round((test.submitted / test.enrolled) * 100) : 0;

            return (
              <div key={test.id} className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}>
                
                {/* Left Side: Status, Title, Instructor */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-6 h-6 shrink-0 flex justify-center items-center rounded border ${styles.bg} ${styles.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                  </div>
                  
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-foreground flex items-center gap-2">
                      {test.title} 
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border bg-muted/50 text-muted-foreground uppercase">{test.course}</span>
                    </span>
                    <span className="text-xs text-muted-foreground truncate mt-0.5">
                      {test.instructor}
                    </span>
                    {test.flagReason && (
                      <span className="text-xs text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {test.flagReason}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Side: Stats & Actions */}
                <div className="flex items-center gap-6 shrink-0 pl-4">
                  
                  {/* Engagement (Submitted vs Enrolled) */}
                  <div className="hidden md:flex flex-col w-24 text-left">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3"/> {test.submitted}/{test.enrolled}</span>
                      <span className="font-mono">{completionRate}%</span>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${completionRate}%` }} />
                    </div>
                  </div>
                  
                  {/* Timeline */}
                  <span className="hidden md:flex items-center gap-1.5 w-24 text-left text-muted-foreground text-xs font-mono">
                    <CalendarClock className="w-3.5 h-3.5" /> {test.dueDate}
                  </span>
                  
                  {/* Actions */}
                  <div className="w-8 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                        <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">Admin Overrides</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Eye className="mr-2 h-4 w-4 text-muted-foreground" /> View Submissions
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" /> Extend Deadline
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator className="bg-border" />
                        
                        {test.status !== "Closed" && (
                          <DropdownMenuItem className="text-amber-600 dark:text-amber-500 focus:bg-amber-500/10 focus:text-amber-600 cursor-pointer">
                            <Archive className="mr-2 h-4 w-4" /> Force Close Exam
                          </DropdownMenuItem>
                        )}
                        
                        {test.status !== "Flagged" ? (
                          <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                            <ShieldAlert className="mr-2 h-4 w-4" /> Flag for Policy Violation
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve Flag
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer">
                          <Ban className="mr-2 h-4 w-4" /> Delete Exam (Hard)
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
            <p>No exams match your current filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}