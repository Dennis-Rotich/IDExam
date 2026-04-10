import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Check, CalendarDays, Search, ArrowUpDown, ListFilter, 
  Circle, Shuffle, MonitorPlay, Lock, Database, Code2, 
  TerminalSquare, GitMerge, FileJson2, LayoutGrid, ChevronDown,
  Loader2, ChevronLeft, ChevronRight
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { getDifficultyColor } from "../../utils/string";
import { getPracticeQuestionsApi, type PracticeQuestion } from "../../api/practice";

const CATEGORIES = [
  { name: "All Topics", icon: LayoutGrid, color: "text-foreground" },
  { name: "Algorithms", icon: GitMerge, color: "text-emerald-500" },
  { name: "Database", icon: Database, color: "text-blue-500" },
  { name: "Shell", icon: TerminalSquare, color: "text-amber-500" },
  { name: "Concurrency", icon: Code2, color: "text-purple-500" },
  { name: "JavaScript", icon: FileJson2, color: "text-yellow-500" },
];

function getStatusIcon(status: string) {
  if (status === "solved") return <Check className="w-4 h-4 text-emerald-500" />;
  if (status === "calendar") return <CalendarDays className="w-4 h-4 text-blue-500" />;
  return <div className="w-4 h-4" />; 
}

export function StudentPractice() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Server-Side Filter States
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);

  // Note: For a true scalable app, dynamicTags should also be fetched from a separate aggregate endpoint.
  // We use a static mock here to preserve the UI layout until you build the backend aggregation route.
  const dynamicTags = [
    { name: "Array", count: 2133 }, { name: "String", count: 864 }, { name: "Hash Table", count: 805 }
  ];

  useEffect(() => {
    // Reset to page 1 whenever a filter changes
    setPage(1);
  }, [searchQuery, activeCategory, activeTag]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        
        const response = await getPracticeQuestionsApi({
          page,
          limit: 20,
          search: searchQuery,
          category: activeCategory === "All Topics" ? undefined : activeCategory,
          tag: activeTag
        });

        // Map the paginated backend response
        setQuestions(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalQuestions(response.pagination?.totalItems || 0);
        
        // This requires the backend to send the overall solved count in the payload
        if (response.meta?.totalSolved !== undefined) {
          setTotalSolved(response.meta.totalSolved);
        }
      } catch (error) {
        console.error("Failed to load practice questions", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the search input slightly to prevent spamming the API
    const delayDebounceFn = setTimeout(() => {
      loadQuestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchQuery, activeCategory, activeTag]);

  return (
    <div className="mx-auto space-y-6 pb-12 text-left text-foreground px-2">
      
      {/* 1. TAGS ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide mask-fade-right w-full pr-4">
          {dynamicTags.map((tag) => (
            <button 
              key={tag.name} 
              onClick={() => setActiveTag(activeTag === tag.name ? null : tag.name)}
              className={`flex items-center gap-1.5 whitespace-nowrap transition-colors outline-none ${
                activeTag === tag.name ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`text-sm ${activeTag === tag.name ? "font-semibold" : ""}`}>{tag.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTag === tag.name ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground"
              }`}>
                {tag.count}
              </span>
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs shrink-0 mb-2">
          Expand <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </div>

      {/* 2. CATEGORIES ROW */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <Button 
              key={cat.name}
              onClick={() => {
                setActiveCategory(cat.name);
                setActiveTag(null);
              }}
              variant={isActive ? "default" : "secondary"}
              className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-foreground text-background hover:bg-foreground/90" 
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              <cat.icon className={`w-4 h-4 mr-2 ${isActive ? "text-background" : cat.color}`} />
              {cat.name}
            </Button>
          )
        })}
      </div>

      {/* 3. SEARCH & FILTERS ROW */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search questions" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" 
            />
          </div>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-emerald-500/50" />
            <span>{totalSolved} / {totalQuestions} Solved</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 4. PROBLEM LIST WITH HEADER */}
      <div className="w-full text-sm">
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <div className="flex justify-between gap-1">
            <div className="">Status</div>
            <div>Title</div>
          </div>
          <div className="flex items-center gap-6 shrink-0 pl-4">
            <span className="w-16 text-right">Acceptance</span>
            <span className="w-16 text-left">Difficulty</span>
            <div className="w-10 text-right">Freq</div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex py-12 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : questions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-lg mt-4">
            No questions match your current filters.
          </div>
        ) : (
          questions.map((prob, idx) => (
            <Link 
              to={`/practice/${prob._id}`} 
              key={prob._id} 
              className={`flex items-center justify-between py-3 px-4 transition-colors cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border ${
                idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"
              } hover:bg-muted/40 active:bg-muted/60`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-5 shrink-0 flex justify-center">
                  {getStatusIcon(prob.status)}
                </div>
                <div className="flex items-center gap-2 truncate text-foreground hover:text-blue-500 transition-colors">
                  <span className="font-medium opacity-80">{prob.questionId}.</span>
                  <span className="truncate font-medium">{prob.title}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 pl-4">
                <span className="text-muted-foreground w-16 text-right font-mono text-xs">
                  {prob.acceptanceRate}%
                </span>
                <span className={`w-16 text-left font-medium ${getDifficultyColor(prob.difficulty)}`}>
                  {prob.difficulty}
                </span>
                <div className="flex items-center gap-2 w-10 justify-end text-muted-foreground">
                  <MonitorPlay className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
                  <Lock className="w-3.5 h-3.5 opacity-40" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* 5. PAGINATION CONTROLS */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-border mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

    </div>
  );
}