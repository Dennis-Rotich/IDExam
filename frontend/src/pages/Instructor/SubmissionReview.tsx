import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle2, XCircle, Clock, AlertTriangle, 
  Save, AlignLeft, Code2, Loader2, CheckSquare
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { 
  getStudentSubmissionApi, 
  updateAnswerScoreApi,
  markSubmissionGradedApi 
} from "../../api/submission";

export function InstructorSubmissionReview() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  
  // State
  const [submission, setSubmission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeAnswerId, setActiveAnswerId] = useState<string | null>(null);
  const [manualScore, setManualScore] = useState<string>("0");
  const [feedback, setFeedback] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!submissionId) return;
      try {
        setIsLoading(true);
        const response = await getStudentSubmissionApi(submissionId);
        const data = response.submission || response;
        
        setSubmission(data);
        
        if (data.answers && data.answers.length > 0) {
          const firstAnswer = data.answers[0];
          setActiveAnswerId(firstAnswer._id || firstAnswer.questionId);
          setManualScore(firstAnswer.score?.toString() || "0");
          setFeedback(firstAnswer.instructorFeedback || "");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load submission details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmission();
  }, [submissionId]);

  // Handle Question Change in Sidebar
  const handleQuestionSelect = (answer: any) => {
    setActiveAnswerId(answer._id || answer.questionId._id);
    setManualScore(answer.score?.toString() || "0");
    setFeedback(answer.feedback || ""); 
  };

  // Handle Save Override for a SINGLE question
  const handleSaveOverride = async () => {
    if (!submissionId || !activeAnswerId) return;
    try {
      setIsSaving(true);
      
      const newScore = Number(manualScore);
      await updateAnswerScoreApi(submissionId, activeAnswerId, {
        score: newScore,
        feedback: feedback
      });

      // Optimistically update local state
      setSubmission((prev: any) => {
        const updatedAnswers = prev.answers.map((ans: any) => {
          if ((ans._id || ans.questionId._id) === activeAnswerId) {
            return { ...ans, score: newScore, feedback: feedback };
          }
          return ans;
        });
        const newTotalScore = updatedAnswers.reduce((sum: number, ans: any) => sum + (ans.score || 0), 0);
        return { ...prev, answers: updatedAnswers, totalScore: newTotalScore };
      });

      toast.success("Score and feedback saved.");
    } catch (err) {
      toast.error("Failed to save the updated score.");
    } finally {
      setIsSaving(false);
    }
  };

  // Mark the whole submission as officially graded
  const handleCompleteGrading = async () => {
    if (!submissionId) return;
    try {
      setIsFinalizing(true);
      await markSubmissionGradedApi(submissionId);
      toast.success("Submission officially marked as graded!");
      
      // Update local state to reflect the new status
      setSubmission((prev: any) => ({ ...prev, status: "graded" }));
      
    } catch (error) {
      toast.error("Failed to finalize grading.");
    } finally {
      setIsFinalizing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading submission details...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)]">
        <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
        <p className="text-foreground font-medium">{error || "Submission not found"}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  // Derived Variables
  const activeAnswer = submission.answers?.find((a: any) => (a._id || a.questionId._id) === activeAnswerId);
  const questionDetails = activeAnswer?.questionId || {}; 
  const durationMins = submission.startedAt && submission.submittedAt 
    ? Math.round((new Date(submission.submittedAt).getTime() - new Date(submission.startedAt).getTime()) / 60000)
    : "-";

  const passMark = submission.exam?.passMark ?? 50;
  const hasPassed = submission.totalScore >= passMark;
  const isOfficiallyGraded = submission.status === "graded";

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground px-2 h-[calc(100vh-60px)] flex flex-col text-left animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(`/instructor/exam/${submission.exam?._id || submission.exam}/submissions`)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {submission.student?.name || "Unknown Student"} 
              <Badge variant="outline" className={`font-medium px-2 py-0 text-[10px] capitalize ${isOfficiallyGraded ? 'text-emerald-500 border-none' : 'text-amber-500 border-none'}`}>
                {submission.status?.replace("-", " ")}
              </Badge>
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span>{submission.exam?.title || "Exam"}</span> • 
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {durationMins} mins</span> • 
              <span>Submitted: {submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "N/A"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Grade</p>
            <p className="text-xl font-bold text-foreground font-mono">
              {submission.totalScore}
              {submission.exam?.totalPoints !== undefined && <span className="text-sm text-muted-foreground font-sans"> / {submission.exam.totalPoints}</span>}
            </p>
            {submission.status !== "in-progress" && (
              <Badge variant="outline" className={`mt-1 font-bold border px-2 py-0 text-[10px] ${hasPassed ? "text-emerald-500 border-none" : "text-destructive border-none"}`}>
                {hasPassed ? 'PASSED' : 'FAILED'}
              </Badge>
            )}
          </div>
          
          {/* INSTRUCTOR ACTION: Complete Grading */}
          <div className="border-l border-border pl-6">
             <Button 
               disabled={isOfficiallyGraded || isFinalizing}
               onClick={handleCompleteGrading}
               className={`gap-2 ${isOfficiallyGraded ? 'bg-emerald-600 opacity-100 text-white' : ''}`}
             >
               {isFinalizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
               {isOfficiallyGraded ? 'Grading Complete' : 'Complete Grading'}
             </Button>
          </div>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* LEFT: Question Navigation */}
        <div className="w-64 shrink-0 flex flex-col gap-1 overflow-y-auto pr-2 border-r border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Questions</h3>
          {submission.answers?.map((ans: any, index: number) => {
            const isSelected = (ans._id || ans.questionId._id) === activeAnswerId;
            const maxPoints = ans.questionId?.pointsWeight || 0;
            const isFullCredit = ans.score === maxPoints && maxPoints > 0;
            const isZero = ans.score === 0;
            
            return (
              <button
                key={ans._id || index} 
                onClick={() => handleQuestionSelect(ans)}
                className={`text-left p-3 rounded-md transition-colors outline-none ${isSelected ? "bg-muted/50 border border-border" : "bg-transparent border border-transparent hover:bg-muted/30"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-medium text-sm ${isSelected ? "text-foreground" : "text-foreground/80"}`}>Q{index + 1}</span>
                  <span className={`text-xs font-mono font-medium ${isFullCredit ? 'text-emerald-500' : isZero ? 'text-destructive' : 'text-amber-500'}`}>
                    {ans.score}/{maxPoints}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{ans.questionId?.title || `Question ${index + 1}`}</p>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Active Question Grading Panel */}
        {activeAnswer && (
          <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-6 pr-2">
            
            <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden shrink-0">
              <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <AlignLeft className="w-3.5 h-3.5" /> Prompt
              </div>
              <div className="p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {questionDetails.description || "No description provided."}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[400px]">
              
              {/* Student Submission Display */}
              <div className="flex flex-col border border-border rounded-lg overflow-hidden h-full">
                <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Code2 className="w-3.5 h-3.5" /> Student Answer
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded capitalize">
                    {activeAnswer.language || "Text"}
                  </span>
                </div>
                <div className="flex-1 bg-[#1e1e1e]">
                  <textarea 
                    readOnly 
                    value={activeAnswer.answer || activeAnswer.code || "No answer provided."} 
                    className="w-full h-full p-4 bg-transparent text-[#d4d4d4] font-mono text-sm border-none focus:ring-0 resize-none outline-none" 
                  />
                </div>
              </div>

              {/* Execution Results & Grading Controls */}
              <div className="flex flex-col gap-6 h-full">
                {activeAnswer.testResults && activeAnswer.testResults.length > 0 && (
                  <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden shrink-0 max-h-64 overflow-y-auto">
                    <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center justify-between sticky top-0 backdrop-blur-md z-10">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Execution Results</div>
                    </div>
                    <div className="divide-y divide-border">
                      {activeAnswer.testResults.map((tc: any, idx: number) => {
                        const originalTest = questionDetails.testCases?.find((qtc: any) => qtc._id === tc.testCaseId);
                        return (
                          <div key={tc._id || idx} className="p-3 text-sm flex items-start gap-3 bg-transparent">
                            <div className="mt-0.5">{tc.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-destructive" />}</div>
                            <div className="flex-1 space-y-1 font-mono text-xs">
                              {originalTest?.input && <div className="text-muted-foreground">In: <span className="text-foreground">{originalTest.input}</span></div>}
                              <div className="flex flex-col xl:flex-row gap-2 xl:gap-4">
                                {originalTest?.expectedOutput && <span className="text-muted-foreground">Exp: <span className="text-emerald-500">{originalTest.expectedOutput}</span></span>}
                                <span className="text-muted-foreground">Got: <span className={tc.passed ? "text-emerald-500" : "text-destructive"}>{tc.errorMessage || tc.actualOutput || "No output"}</span></span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Grading Action Panel */}
                <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden flex-1">
                  <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center justify-between">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manual Override</div>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={manualScore} 
                        onChange={(e) => setManualScore(e.target.value)} 
                        className="w-16 h-7 text-right bg-background border-border text-foreground font-mono text-xs focus-visible:ring-1 focus-visible:ring-primary" 
                      />
                      <span className="text-muted-foreground text-xs font-mono">/ {questionDetails.pointsWeight || "-"} pts</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    {activeAnswer.status === "Compilation Error" && (
                      <div className="bg-destructive/5 border border-destructive/20 p-3 rounded-md flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-[11px] text-destructive/90">Code failed to compile. Automatic score was 0.</p>
                      </div>
                    )}
                    <Textarea 
                      placeholder="Leave private feedback for the student regarding this question..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="flex-1 bg-background border-border text-foreground resize-none text-sm p-3 focus-visible:ring-1 focus-visible:ring-border"
                    />
                    <div className="flex justify-end pt-2">
                      <Button 
                        disabled={isSaving} 
                        onClick={handleSaveOverride} 
                        className="bg-foreground text-background hover:bg-foreground/90 h-8 rounded-full px-5 text-xs"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
                        {isSaving ? "Saving..." : "Save Override"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}