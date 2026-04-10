import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronRight, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export function SubmissionHistory({
  history,
  uniqueSubjects,
  scoreColor,
  getStatusIcon,
}: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filteredHistory = history.filter((test: any) => {
    const matchesSearch = test.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || test.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-4">
      {/* 1. Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Submission History
          </h2>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              className="pl-9 bg-muted/30 border-transparent rounded-full h-9 text-sm focus-visible:ring-1 focus-visible:ring-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-transparent rounded-full text-sm hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder="Subject" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {uniqueSubjects.map((sub: string) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 2. List Layout */}
      <div className="w-full text-sm">
        {/* Table Header Row */}
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase mb-2">
          <div className="flex justify-between gap-1">
            <div className="">Status</div>
            <div>Title & Subject</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-24 text-left">Date Taken</span>
            <span className="w-16 text-right">Score</span>
            <div className="w-24 text-right">Action</div>
          </div>
        </div>

        {/* Table Body (Mapping the already-formatted history) */}
        {filteredHistory.length > 0 ? (
          filteredHistory.map((test: any, idx: number) => (
            <div
              key={test.id}
              className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-5 shrink-0 flex justify-center">
                  {getStatusIcon(test.score, test.passed, test.status)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-medium text-foreground">
                    {test.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {test.subject} • {test.timeSpent} spent
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 pl-4">
                <span className="hidden md:flex items-center gap-1.5 w-24 text-left text-muted-foreground text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(test.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>

                <span
                  className={`hidden md:inline-block w-16 text-right font-mono font-bold ${scoreColor(test.score)}`}
                >
                  {test.score !== null ? `${test.score}%` : "Pending"}
                </span>

                <div className="w-24 flex justify-end">
                  {test.status === "graded" ? (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Link to={`/student/results/${test.id}`}>
                        Review <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground/50 pr-2">
                      Awaiting Grade
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed border-border rounded-lg mt-2">
            <Search className="h-8 w-8 mb-3 opacity-20" />
            <p>No results found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
