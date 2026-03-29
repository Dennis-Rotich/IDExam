import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Check, CalendarDays, Search, ArrowUpDown, ListFilter, 
  Circle, Shuffle, MonitorPlay, Lock, Database, Code2, 
  TerminalSquare, GitMerge, FileJson2, LayoutGrid, ChevronDown
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

// --- MOCK DATA ---
const TAGS = [
  { name: "Array", count: 2133 },
  { name: "String", count: 864 },
  { name: "Hash Table", count: 805 },
  { name: "Math", count: 663 },
  { name: "Dynamic Programming", count: 648 },
  { name: "Sorting", count: 510 },
  { name: "Greedy", count: 457 },
  { name: "Depth-First Search", count: 289 },
];

// Added specific icon colors matching the uploaded image
const CATEGORIES = [
  { name: "All Topics", icon: LayoutGrid, color: "text-foreground" },
  { name: "Algorithms", icon: GitMerge, color: "text-emerald-500" },
  { name: "Database", icon: Database, color: "text-blue-500" },
  { name: "Shell", icon: TerminalSquare, color: "text-amber-500" },
  { name: "Concurrency", icon: Code2, color: "text-purple-500" },
  { name: "JavaScript", icon: FileJson2, color: "text-yellow-500" },
];

const PROBLEMS = [
  { id: 2946, title: "Matrix Similarity After Cyclic Shifts", acceptance: "73.7%", difficulty: "Easy", status: "calendar" },
  { id: 1, title: "Two Sum", acceptance: "57.2%", difficulty: "Easy", status: "solved" },
  { id: 2, title: "Add Two Numbers", acceptance: "48.2%", difficulty: "Med.", status: "solved" },
  { id: 3, title: "Longest Substring Without Repeating Characters", acceptance: "38.7%", difficulty: "Med.", status: "none" },
  { id: 4, title: "Median of Two Sorted Arrays", acceptance: "46.2%", difficulty: "Hard", status: "none" },
  { id: 5, title: "Longest Palindromic Substring", acceptance: "37.5%", difficulty: "Med.", status: "none" },
  { id: 6, title: "Zigzag Conversion", acceptance: "53.8%", difficulty: "Med.", status: "none" },
  { id: 7, title: "Reverse Integer", acceptance: "31.7%", difficulty: "Med.", status: "none" },
  { id: 8, title: "String to Integer (atoi)", acceptance: "20.7%", difficulty: "Med.", status: "none" },
  { id: 9, title: "Palindrome Number", acceptance: "60.4%", difficulty: "Easy", status: "solved" },
  { id: 10, title: "Regular Expression Matching", acceptance: "30.6%", difficulty: "Hard", status: "none" },
  { id: 11, title: "Container With Most Water", acceptance: "59.7%", difficulty: "Med.", status: "none" },
  { id: 12, title: "Integer to Roman", acceptance: "70.7%", difficulty: "Med.", status: "none" },
];

// --- HELPER FUNCTIONS ---
function getDifficultyColor(diff: string) {
  if (diff === "Easy") return "text-teal-500";
  if (diff === "Med.") return "text-amber-500";
  if (diff === "Hard.") return "text-red-500";
  return "text-destructive";
}

function getStatusIcon(status: string) {
  if (status === "solved") return <Check className="w-4 h-4 text-emerald-500" />;
  if (status === "calendar") return <CalendarDays className="w-4 h-4 text-blue-500" />;
  return <div className="w-4 h-4" />; // Empty placeholder for perfect alignment
}

export function StudentPractice() {
  // Interactive States
  const [activeCategory, setActiveCategory] = useState("All Topics");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  return (
    <div className="mx-auto space-y-6 pb-12 text-left text-foreground px-2">
      
      {/* 1. TAGS ROW */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide mask-fade-right w-full pr-4">
          {TAGS.map((tag) => (
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
              onClick={() => setActiveCategory(cat.name)}
              variant={isActive ? "default" : "secondary"}
              className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-foreground text-background hover:bg-foreground/90" 
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
              }`}
            >
              {/* If active, the icon inherits the inverted text color. If inactive, it uses its assigned brand color. */}
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
            <span>23 / 3879 Solved</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 4. PROBLEM LIST WITH HEADER */}
      <div className="w-full text-sm">
        
        {/* Table Header */}
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

        {/* Table Body */}
        {PROBLEMS.map((prob, idx) => (
          <Link 
            to={`/practice/${prob.id}`} // Makes the entire row a clickable route
            key={prob.id} 
            className={`flex items-center justify-between py-3 px-4 transition-colors cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border ${
              idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"
            } hover:bg-muted/40 active:bg-muted/60`}
          >
            {/* Left Side: Status & Title */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-5 shrink-0 flex justify-center">
                {getStatusIcon(prob.status)}
              </div>
              <div className="flex items-center gap-2 truncate text-foreground hover:text-blue-500 transition-colors">
                <span className="font-medium opacity-80">{prob.id}.</span>
                <span className="truncate font-medium">{prob.title}</span>
              </div>
            </div>

            {/* Right Side: Stats & Icons */}
            <div className="flex items-center gap-6 shrink-0 pl-4">
              <span className="text-muted-foreground w-16 text-right font-mono text-xs">{prob.acceptance}</span>
              <span className={`w-16 text-left font-medium ${getDifficultyColor(prob.difficulty)}`}>
                {prob.difficulty}
              </span>
              <div className="flex items-center gap-2 w-10 justify-end text-muted-foreground">
                <MonitorPlay className="w-4 h-4 opacity-0 hover:opacity-100 transition-opacity" />
                <Lock className="w-3.5 h-3.5 opacity-40" />
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}