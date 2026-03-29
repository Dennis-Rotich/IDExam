import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CalendarClock, Check, Lock, ChevronRight, ListFilter, PlayCircle, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FeedbackModal } from "../../components/Student/FeedbackModal";

// ... (Keep existing BrowseTest interface and MOCK_TESTS data)
type TestAvailability = "available" | "completed" | "upcoming" | "locked";
export interface BrowseTest { id: string; title: string; subject: string; instructorName: string; availability: TestAvailability; questionCount: number; durationMinutes: number; availableFrom: string; dueDate: string; score?: number; inProgress?: boolean; }
const MOCK_TESTS: BrowseTest[] = [
  { id: "1", title: "Midterm: Data Structures", subject: "CS201", instructorName: "Dr. Sarah Okonkwo", availability: "available", questionCount: 40, durationMinutes: 90, availableFrom: "2026-03-15", dueDate: "2026-04-10", inProgress: true },
  { id: "2", title: "Quiz 3 — Binary Trees", subject: "CS201", instructorName: "Dr. Sarah Okonkwo", availability: "completed", questionCount: 15, durationMinutes: 30, availableFrom: "2026-03-20", dueDate: "2026-03-28", score: 87 },
  { id: "3", title: "Quiz 2 — Linked Lists", subject: "CS201", instructorName: "Dr. Sarah Okonkwo", availability: "completed", questionCount: 15, durationMinutes: 30, availableFrom: "2026-03-07", dueDate: "2026-03-14", score: 73 },
  { id: "4", title: "Final Exam", subject: "CS201", instructorName: "Dr. Sarah Okonkwo", availability: "upcoming", questionCount: 60, durationMinutes: 180, availableFrom: "2026-05-18", dueDate: "2026-05-20" },
  { id: "5", title: "Intro to Algorithms — Quiz 1", subject: "CS301", instructorName: "Prof. James Velez", availability: "locked", questionCount: 20, durationMinutes: 45, availableFrom: "2026-04-01", dueDate: "2026-04-07" },
];

function getStatusIcon(availability: string, inProgress?: boolean) {
  if (availability === "completed") return <Check className="w-4 h-4 text-emerald-500" />;
  if (availability === "locked") return <Lock className="w-4 h-4 text-muted-foreground/50" />;
  if (availability === "upcoming") return <CalendarClock className="w-4 h-4 text-blue-500" />;
  if (inProgress) return <PlayCircle className="w-4 h-4 text-amber-500" />;
  return <div className="w-4 h-4 rounded-full border border-muted-foreground/50" />; // Available/Not started
}

type FilterTab = "all" | TestAvailability;

export function StudentTestsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedFeedbackTest, setSelectedFeedbackTest] = useState<BrowseTest | null>(null);

  const filtered = MOCK_TESTS.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || t.availability === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = [
    { id: "all", label: "All Tests" },
    { id: "available", label: "Available" },
    { id: "completed", label: "Completed" },
    { id: "upcoming", label: "Upcoming" },
  ];

  return (
    <div className="mx-auto space-y-6 pb-12 text-left text-foreground px-2">
      
      {/* HEADER & CATEGORIES */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = filter === cat.id;
          return (
            <Button 
              key={cat.id} onClick={() => setFilter(cat.id as FilterTab)} variant={isActive ? "default" : "secondary"}
              className={`rounded-full h-9 px-5 shrink-0 text-sm font-medium transition-colors ${
                isActive ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              {cat.label}
            </Button>
          )
        })}
      </div>

      {/* SEARCH ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search assignments..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* LIST HEADER */}
      <div className="w-full text-sm">
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <div className="flex justify-between gap-1">
            <div className="">Status</div>
            <div>Title & Subject</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-20 text-left">Questions</span>
            <span className="w-20 text-left">Duration</span>
            <span className="w-32 text-left">Due Date</span>
            <div className="w-24 text-right">Action</div>
          </div>
        </div>

        {/* LIST BODY */}
        {filtered.map((test, idx) => (
          <div key={test.id} className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}>
            
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-5 shrink-0 flex justify-center">{getStatusIcon(test.availability, test.inProgress)}</div>
              <div className="flex flex-col min-w-0">
                <span className="truncate font-medium text-foreground">{test.title}</span>
                <span className="text-xs text-muted-foreground">{test.subject} • {test.instructorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-6 shrink-0 pl-4">
              <span className="hidden md:inline-block w-20 text-left text-muted-foreground">{test.questionCount} Qs</span>
              <span className="hidden md:inline-block w-20 text-left text-muted-foreground">{test.durationMinutes}m</span>
              <span className="hidden md:inline-block w-32 text-left text-muted-foreground font-mono text-xs">
                {new Date(test.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              
              <div className="w-24 flex justify-end">
                {test.availability === "completed" && (
                  <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground" onClick={() => setSelectedFeedbackTest(test)}>
                    {test.score}% <FileText className="w-3 h-3 ml-2" />
                  </Button>
                )}
                {test.availability === "available" && (
                  <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-xs text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                    <Link to={`/exam/${test.id}`}>{test.inProgress ? "Resume" : "Start"} <ChevronRight className="w-3 h-3 ml-1" /></Link>
                  </Button>
                )}
                {(test.availability === "locked" || test.availability === "upcoming") && (
                   <span className="text-xs text-muted-foreground/50 pr-2">Locked</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <FeedbackModal test={selectedFeedbackTest} onClose={() => setSelectedFeedbackTest(null)} />
    </div>
  );
}