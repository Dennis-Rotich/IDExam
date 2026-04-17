import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, Target, CheckCircle2, 
  Circle, Code2, AlignLeft, Edit, Globe, FileText, Loader2, AlertTriangle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

// Re-using your standard exam fetcher + the new toggle API
import { getExamApi, togglePublishExamApi } from "../../api/exam"; 

export function InstructorExamPreview() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch using your existing, unified GET route
  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;
      try {
        setIsLoading(true);
        const res = await getExamApi(examId);
        setExam(res.exam || res);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load exam preview.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  // 2. The Toggle Publish Handler
  const handlePublishToggle = async () => {
    try {
      setIsPublishing(true);
      // Hits your PATCH /exam/:examId/publish endpoint
      const res = await togglePublishExamApi(examId!); 
      
      // Update local state based on the backend response
      setExam((prev: any) => ({ ...prev, status: res.status }));
      toast.success(`Exam is now ${res.status}!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change exam status.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading exam preview...</p>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
        <p className="text-foreground font-medium">{error || "Exam not found"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/instructor/exams")}>Back to Exams</Button>
      </div>
    );
  }

  const isPublished = exam.status === "published";
  const questions = exam.questions || [];
  // Fallback calculation in case the backend totalPoints hasn't updated yet
  const totalPointsCalc = questions.reduce((acc: number, q: any) => acc + (q.pointsWeight || 0), 0);

  return (
    <div className="mx-auto space-y-8 pb-12 text-foreground text-left px-2 animate-in fade-in duration-300 max-w-5xl">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-start gap-4">
          <Link to="/instructor/exams">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider bg-muted/50">
                {exam.courseCode || "General"}
              </Badge>
              <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wider border-transparent ${isPublished ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {exam.status || "Draft"}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{exam.title}</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              {exam.instructions || "No instructions provided."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to={`/instructor/exam/${examId}/edit`}>
            <Button variant="outline" className="h-9 gap-2">
              <Edit className="w-4 h-4" /> Edit Details
            </Button>
          </Link>
          <Button 
            onClick={handlePublishToggle} 
            disabled={isPublishing || questions.length === 0}
            className={`h-9 gap-2 ${isPublished ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-foreground text-background'}`}
          >
            {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            {isPublished ? "Unpublish Exam" : "Publish Exam"}
          </Button>
        </div>
      </div>

      {/* EXAM METADATA STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-border bg-card/30 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> Duration</span>
          <span className="text-xl font-mono">{exam.durationInMinutes || 0} <span className="text-sm font-sans text-muted-foreground">mins</span></span>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card/30 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Questions</span>
          <span className="text-xl font-mono">{questions.length}</span>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card/30 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Target className="w-3.5 h-3.5"/> Total Points</span>
          <span className="text-xl font-mono">{exam.totalPoints || totalPointsCalc}</span>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card/30 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Pass Mark</span>
          <span className="text-xl font-mono">{exam.passMark || 50}%</span>
        </div>
      </div>

      {/* QUESTIONS BREAKDOWN */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Question Breakdown</h2>
          <Link to={`/instructor/exam/${examId}/questions/add`}>
            <Button size="sm" variant="secondary" className="h-8 text-xs">Add Question</Button>
          </Link>
        </div>

        {questions.length === 0 ? (
          <div className="text-center p-12 border border-dashed border-border rounded-lg text-muted-foreground">
            No questions have been added to this exam yet.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q: any, idx: number) => (
              <div key={q._id || idx} className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden">
                
                {/* Question Header */}
                <div className="p-4 bg-muted/10 border-b border-border flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-foreground">Question {idx + 1}</span>
                      <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider bg-background">
                        {q.type?.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider bg-background">
                        {q.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{q.description}</p>
                  </div>
                  <div className="text-sm font-mono font-medium text-muted-foreground shrink-0 bg-background px-2 py-1 rounded border border-border">
                    {q.pointsWeight} pts
                  </div>
                </div>

                {/* Dynamic Answer Rendering Based on Type */}
                <div className="p-4">
                  {q.type === "CODING" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" /> Reference Solution
                        </span>
                        <div className="bg-[#1e1e1e] rounded-md p-4 overflow-x-auto">
                          <pre className="text-xs font-mono text-emerald-400"><code>{q.referenceSolution || "No reference solution provided."}</code></pre>
                        </div>
                      </div>
                      {q.testCases && q.testCases.length > 0 && (
                        <div className="pt-2 border-t border-border/50">
                          <span className="text-xs font-medium text-muted-foreground mb-2 block">{q.testCases.length} Test Cases Configured</span>
                          <div className="flex flex-wrap gap-2">
                            {q.testCases.map((tc: any, tIdx: number) => (
                              <Badge key={tIdx} variant="outline" className={`text-[10px] ${tc.isHidden ? 'border-amber-500/30 text-amber-500' : 'border-border text-muted-foreground'}`}>
                                Case {tIdx + 1} {tc.isHidden && '(Hidden)'}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {q.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                        <AlignLeft className="w-3.5 h-3.5" /> Options
                      </span>
                      <div className="grid grid-cols-1 gap-2">
                        {q.options?.map((opt: string, optIdx: number) => {
                          const isCorrect = String(q.correctAnswer) === String(opt);
                          return (
                            <div key={optIdx} className={`flex items-center gap-3 p-2.5 rounded-md border text-sm ${isCorrect ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-medium' : 'border-border bg-background text-foreground'}`}>
                              {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {q.type === "TRUE_FALSE" && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                      </span>
                      <div className="flex gap-4">
                        <div className={`px-6 py-2 rounded-md border text-sm font-medium ${q.correctAnswer === true ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-border text-muted-foreground opacity-50'}`}>True</div>
                        <div className={`px-6 py-2 rounded-md border text-sm font-medium ${q.correctAnswer === false ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-border text-muted-foreground opacity-50'}`}>False</div>
                      </div>
                    </div>
                  )}

                  {q.type === "SHORT_ANSWER" && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                        <AlignLeft className="w-3.5 h-3.5" /> Expected Exact Match
                      </span>
                      <div className="bg-muted/30 border border-border rounded-md p-3 text-sm font-mono text-emerald-600 dark:text-emerald-400">
                        {String(q.correctAnswer)}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}