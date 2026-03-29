import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { useState, useLayoutEffect, useRef, useEffect, useCallback } from "react";
import { MonacoInstance } from "../../components/Editor/MonacoInstance";
import { LoadingExam } from "../Loading/StudentPageLoading";
import { AutoSaveIndicator } from "../../components/Layout/AutoSaveIndicator";
import { StudentConsole } from "../../components/Student/StudentConsole";
import { Timer } from "../../components/Layout/Timer";
import { Settings, User, HelpCircle, Loader2, CheckCircle } from "lucide-react";
import { useExamStore } from "../../store/useExamStore";
import { EXAM_QUESTIONS } from "../../data/questions";
import { Button } from "../../components/ui/button";

export const StudentExam = () => {
  const { currentQuestionIndex, questions, isLoading, setQuestions, setCurrentQuestionIndex } = useExamStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [minPercentage, setMinPercentage] = useState(20);
  const [running, setIsRunning] = useState(false);
  const [examStatus, setExamStatus] = useState<"in-progress" | "submitting" | "completed" | "failed">("in-progress");
  const [examEndTime] = useState(new Date(Date.now() + 3600000).toISOString());

  const currentQuestion = questions[currentQuestionIndex] || EXAM_QUESTIONS[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestions(EXAM_QUESTIONS);
      setCurrentQuestionIndex(0);
    }, 6000);
    return () => clearTimeout(timer);
  }, [setQuestions, setCurrentQuestionIndex]);

  useLayoutEffect(() => {
    const calculateMinSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        if (containerWidth > 0) {
          setMinPercentage((280 / containerWidth) * 100);
        }
      }
    };
    calculateMinSize();
    const observer = new ResizeObserver(calculateMinSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const submitExamPayload = async (isAutoSubmit: boolean = false) => {
    if (examStatus !== "in-progress") return; 
    setExamStatus("submitting");
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      setExamStatus("completed");
    } catch (error) {
      console.error("Submission failed:", error);
      setExamStatus("failed");
    }
  };

  const handleTimeUp = useCallback(() => submitExamPayload(true), [examStatus]);

  if (isLoading || !questions || questions.length === 0) return <LoadingExam />;

  if (examStatus === "submitting") {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Submitting Exam...</h2>
        <p className="text-muted-foreground mt-2 text-sm">Please do not close this tab or disconnect your network.</p>
      </div>
    );
  }

  if (examStatus === "completed") {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans">
        <div className="bg-card border border-border p-8 rounded-lg max-w-md text-center shadow-xl">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Submission Successful</h2>
          <p className="text-muted-foreground mb-6 text-sm">Your exam has been securely transmitted and recorded. You may now close this secure environment.</p>
          <Button variant="secondary" onClick={() => window.location.href = "/student/"}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-sans">
      <nav className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-[#00a3a3] font-bold tracking-tighter">tAhIni</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">IDExam Engine</span>
        </div>
        <div className="flex items-center gap-6">
          <Timer endsAt={examEndTime} onTimeUp={handleTimeUp} />
          <div className="flex items-center gap-3 text-muted-foreground">
            <Settings size={18} className="hover:text-foreground cursor-pointer transition-colors" />
            <User size={18} className="hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </nav>

      <main ref={containerRef} className="flex-1 overflow-hidden p-2 bg-muted/30">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={45} minSize={minPercentage} className="flex flex-col bg-card rounded-lg border border-border overflow-hidden">
            <div className="flex items-center px-4 h-10 border-b border-border bg-muted/50 text-xs">
              <span className="border-b-2 border-primary h-full flex items-center font-medium">Description</span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto text-left max-w-[480px]">
              <p className="text-foreground mb-4 leading-relaxed font-sans">
                {currentQuestion.number}. {currentQuestion?.description || "No description available."}
              </p>
            </div>
            <div className="p-3 bg-card border-t border-border">
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id || i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-10 h-10 shrink-0 flex items-center justify-center rounded font-bold transition-all active:scale-95 ${
                      currentQuestionIndex === i
                        ? "bg-primary text-primary-foreground"
                        : q.isAttempted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/50"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-transparent hover:bg-border transition-colors" />

          <ResizablePanel defaultSize={55}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize={70} className="bg-card rounded-lg border border-border flex flex-col overflow-hidden">
                <div className="h-10 border-b border-border px-4 flex items-center justify-between bg-muted/50 text-xs">
                  <span className="text-primary font-mono">Java</span>
                  <HelpCircle size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 relative">
                  <MonacoInstance />
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-2 bg-transparent hover:bg-border transition-colors" />

              <ResizablePanel defaultSize={30} className="bg-card rounded-lg border border-border flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <StudentConsole results={{ output: "", executionTime: "" }} isExecuting={running} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <footer className="h-12 bg-card border-t border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AutoSaveIndicator />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleRunCode} disabled={running} className="h-8 px-4 text-xs font-medium">
            {running ? <Loader2 size={14} className="animate-spin" /> : "Run"}
          </Button>
          <Button onClick={() => submitExamPayload(false)} className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
            Submit Exam
          </Button>
        </div>
      </footer>
    </div>
  );
};