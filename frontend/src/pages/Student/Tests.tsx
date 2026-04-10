import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CalendarClock,
  Check,
  Lock,
  ChevronRight,
  ListFilter,
  PlayCircle,
  FileText,
  Loader2,
  ArrowDownAZ,
  CalendarDays,
  ArrowDown,
  ArrowUp,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { FeedbackModal } from "../../components/Student/FeedbackModal";
import { getAssignedExamsApi} from "../../api/exam";
import { type BrowseTest } from "@/types/exam";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type FilterTab = "all" | BrowseTest["availability"];

function getStatusIcon(availability: string, inProgress?: boolean) {
  if (availability === "completed")
    return <Check className="w-4 h-4 text-emerald-500" />;
  if (availability === "locked")
    return <Lock className="w-4 h-4 text-muted-foreground/50" />;
  if (availability === "upcoming")
    return <CalendarClock className="w-4 h-4 text-blue-500" />;
  if (inProgress) return <PlayCircle className="w-4 h-4 text-amber-500" />;
  return (
    <div className="w-4 h-4 rounded-full border border-muted-foreground/50" />
  ); // Available/Not started
}

export function StudentTestsPage() {
  const [tests, setTests] = useState<BrowseTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedFeedbackTest, setSelectedFeedbackTest] =
    useState<BrowseTest | null>(null);
  const [sortBy, setSortBy] = useState<"dueDate" | "title" | "durationMinutes">(
    "dueDate",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const data = await getAssignedExamsApi();
        setTests(data || []);
      } catch (error) {
        console.error("Failed to load tests", error);
        // You could add a toast.error here
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, []);

  const filteredAndSorted = tests
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || t.availability === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "dueDate") {
        comparison =
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "durationMinutes") {
        comparison = a.durationMinutes - b.durationMinutes;
      }
      return sortOrder === "asc" ? comparison : -comparison;
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
              key={cat.id}
              onClick={() => setFilter(cat.id as FilterTab)}
              variant={isActive ? "default" : "secondary"}
              className={`rounded-full h-9 px-5 shrink-0 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-foreground text-background hover:bg-foreground/90"
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              {cat.label}
            </Button>
          );
        })}
      </div>

      {/* SEARCH ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assignments..."
              className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
              >
                <ListFilter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Sort By
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setSortBy("dueDate")}
                className="cursor-pointer flex justify-between"
              >
                <div className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" /> Due Date
                </div>
                {sortBy === "dueDate" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("title")}
                className="cursor-pointer flex justify-between"
              >
                <div className="flex items-center">
                  <ArrowDownAZ className="mr-2 h-4 w-4" /> Title
                </div>
                {sortBy === "title" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy("durationMinutes")}
                className="cursor-pointer flex justify-between"
              >
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" /> Duration
                </div>
                {sortBy === "durationMinutes" && <Check className="h-4 w-4" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Order
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="cursor-pointer"
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowUp className="mr-2 h-4 w-4" /> Ascending
                  </>
                ) : (
                  <>
                    <ArrowDown className="mr-2 h-4 w-4" /> Descending
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            No tests found matching your criteria.
          </div>
        )}

        {/* LIST BODY */}
        {!isLoading &&
          filteredAndSorted.map((test, idx) => (
            <div
              key={test.id}
              className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-5 shrink-0 flex justify-center">
                  {getStatusIcon(test.availability, test.inProgress)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-medium text-foreground">
                    {test.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {test.subject} • {test.instructorName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 pl-4">
                <span className="hidden md:inline-block w-20 text-left text-muted-foreground">
                  {test.questionCount} Qs
                </span>
                <span className="hidden md:inline-block w-20 text-left text-muted-foreground">
                  {test.durationMinutes}m
                </span>
                <span className="hidden md:inline-block w-32 text-left text-muted-foreground font-mono text-xs">
                  {new Date(test.dueDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <div className="w-24 flex justify-end">
                  {test.availability === "completed" && (
                    // Opens the summary modal, not the full review route
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedFeedbackTest(test)}
                    >
                      {test.score}% <FileText className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                  {test.availability === "available" && (
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-xs text-blue-500 hover:text-blue-400 hover:bg-blue-500/10"
                    >
                      <Link to={`/exam/${test.id}`}>
                        {test.inProgress ? "Resume" : "Start"}{" "}
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                  {(test.availability === "locked" ||
                    test.availability === "upcoming") && (
                    <span className="text-xs text-muted-foreground/50 pr-2">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal renders the summary data injected via the selectedFeedbackTest object */}
      <FeedbackModal
        test={selectedFeedbackTest}
        onClose={() => setSelectedFeedbackTest(null)}
      />
    </div>
  );
}
