import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import {
  Search, Plus, ListFilter, MoreHorizontal, Eye, Copy, FileEdit, Trash, BookOpen, Code2
} from "lucide-react";
import { useQuestionStore, type Question } from "../../store/useQuestionStore";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { QuestionPreviewModal } from "../../components/Instructor/QuestionPreviewModal";

export function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState("");
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "my-questions";
  const handleTabChange = (value: string) => setSearchParams({ tab: value });

  const navigate = useNavigate();
  const { questions, deleteQuestion, duplicateQuestion } = useQuestionStore();

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" ? true : activeTab === "my-questions" ? q.author === "You" : q.author !== "You";
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: "my-questions", label: "My Questions" },
    { id: "network", label: "Department Network" },
    { id: "all", label: "All Questions" },
  ];

  function getDifficultyColor(diff: string) {
    if (diff === "Easy") return "text-emerald-500";
    if (diff === "Medium") return "text-amber-500";
    return "text-destructive";
  }

  return (
    <div className="mx-auto space-y-6 pb-12 text-left text-foreground px-2">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Question Bank</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your questions and explore shared departmental resources.</p>
        </div>
        <Link to="/instructor/questions/new">
          <Button className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90 rounded-full h-9 px-5">
            <Plus className="mr-2 h-4 w-4" /> Create Question
          </Button>
        </Link>
      </div>

      {/* PILL FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button 
                key={tab.id} onClick={() => handleTabChange(tab.id)} variant={isActive ? "default" : "secondary"}
                className={`rounded-full h-9 px-4 shrink-0 text-sm font-medium transition-colors ${
                  isActive ? "bg-foreground text-background hover:bg-foreground/90" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search titles or topics..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* QUESTION LIST */}
      <div className="w-full text-sm">
        <div className="flex items-center justify-between py-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-5 shrink-0 text-center">Type</div>
            <div>Title & Topic</div>
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0 pl-4">
            <span className="w-20 text-left">Difficulty</span>
            <span className="w-32 text-left">Author</span>
            <span className="w-24 text-right">Last Mod</span>
            <div className="w-8 text-right"></div>
          </div>
        </div>

        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => (
            <div key={q.id} className={`flex items-center justify-between py-3 px-4 transition-colors rounded-md ${idx % 2 === 0 ? "bg-muted/10" : "bg-transparent"} hover:bg-muted/30`}>
              
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-5 shrink-0 flex justify-center text-muted-foreground">
                  {q.type === "Code" ? <Code2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate font-medium text-foreground">{q.title}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{q.topic}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 pl-4">
                <span className={`hidden md:inline-block w-20 text-left font-medium ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</span>
                <span className={`hidden md:inline-block w-32 text-left truncate ${q.author === "You" ? "text-foreground font-medium" : "text-muted-foreground"}`}>{q.author}</span>
                <span className="hidden md:inline-block w-24 text-right text-muted-foreground text-xs font-mono">{q.lastModified}</span>
                
                <div className="w-8 flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted rounded-full">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                      <DropdownMenuLabel className="text-muted-foreground text-xs uppercase tracking-wider">Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted" onClick={() => setPreviewQuestion(q)}><Eye className="mr-2 h-4 w-4 text-muted-foreground" /> Preview</DropdownMenuItem>
                      {q.author === "You" ? (
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted" onClick={() => navigate(`/instructor/questions/edit/${q.id}`)}>
                          <FileEdit className="mr-2 h-4 w-4 text-muted-foreground" /> Edit
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="cursor-pointer hover:bg-muted" onClick={() => duplicateQuestion(q.id)}>
                          <Copy className="mr-2 h-4 w-4 text-muted-foreground" /> Duplicate to Mine
                        </DropdownMenuItem>
                      )}
                      {q.author === "You" && (
                        <>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onClick={() => deleteQuestion(q.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="h-8 w-8 mb-3 opacity-20" />
            <p>No questions found matching your filters.</p>
          </div>
        )}
      </div>

      <QuestionPreviewModal question={previewQuestion} onClose={() => setPreviewQuestion(null)} />
    </div>
  );
}