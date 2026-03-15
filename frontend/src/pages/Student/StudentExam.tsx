import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import type { ComponentProps } from "react";
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

type PanelProps = ComponentProps<typeof ResizablePanel>;

export const StudentExam = () => {
  const {
    currentQuestionIndex,
    questions,
    isLoading,
    setQuestions,
    setCurrentQuestionIndex,
  } = useExamStore();

  const containerRef = useRef<HTMLDivElement>(null);

  // Layout States
  const [minPercentage, setMinPercentage] = useState(20);
  const [running, setIsRunning] = useState(false);

  // --- NEW: Submission State Machine ---
  const [examStatus, setExamStatus] = useState<"in-progress" | "submitting" | "completed" | "failed">("in-progress");
  
  // Set exam end time (e.g., 1 hour from load). In reality, fetch this from your backend.
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
          const percentage = (280 / containerWidth) * 100;
          setMinPercentage(percentage);
        }
      }
    };
    calculateMinSize();
    const observer = new ResizeObserver(calculateMinSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // --- NEW: Submission Logic ---
  const submitExamPayload = async (isAutoSubmit: boolean = false) => {
    if (examStatus !== "in-progress") return; // Prevent double firing
    
    setExamStatus("submitting");

    try {
      // Gather data from your Zustand store
      const payload = {
        examId: "EX-101", // Replace with actual ID
        isAutoSubmit,
        // answers: questions.map(...) 
      };

      // In the future: await apiClient.post('/exams/submit', payload);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setExamStatus("completed");
    } catch (error) {
      console.error("Submission failed:", error);
      setExamStatus("failed");
    }
  };

  // Triggered by the Timer component when time === 0
  const handleTimeUp = useCallback(() => {
    console.log("Time up! Auto-submitting.");
    submitExamPayload(true);
  }, [examStatus]);


  // --- GUARD CLAUSES & INTERCEPT SCREENS ---

  if (isLoading || !questions || questions.length === 0) {
    return <LoadingExam />;
  }

  // Intercept the IDE if currently submitting
  if (examStatus === "submitting") {
    return (
      <div className="h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-[#eff1f6] font-sans">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Submitting Exam...</h2>
        <p className="text-slate-400 mt-2 text-sm">Please do not close this tab or disconnect your network.</p>
      </div>
    );
  }

  // Intercept the IDE if submission was successful
  if (examStatus === "completed") {
    return (
      <div className="h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-[#eff1f6] font-sans">
        <div className="bg-[#282828] border border-[#333] p-8 rounded-lg max-w-md text-center shadow-2xl">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Submission Successful</h2>
          <p className="text-slate-400 mb-6 text-sm">Your exam has been securely transmitted and recorded. You may now close this secure environment.</p>
          <Button 
            variant="secondary" 
            className="bg-[#333] hover:bg-[#444] text-white border-0"
            onClick={() => window.location.href = "/"}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // --- STANDARD IDE RENDER ---

  const leftPanelProps: Partial<PanelProps> = {
    defaultSize: 45,
    minSize: minPercentage,
    className:
      "flex flex-col bg-[#282828] rounded-lg border border-[#333] overflow-hidden",
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const codeToRun = questions[currentQuestionIndex]?.code || "";

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Executed code:", codeToRun);
    } catch (error) {
      console.error("Execution failed.", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-[#eff1f6] font-sans selection:bg-blue-500/30">
      <nav className="h-12 border-b border-[#333] bg-[#282828] flex items-center px-4 justify-between">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-blue-500 font-bold tracking-tighter">
            tAhIni
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">IDExam Engine</span>
        </div>
        <div className="flex items-center gap-6">
          {/* Wire the timer to the handleTimeUp function */}
          <Timer
            endsAt={examEndTime}
            onTimeUp={handleTimeUp}
          />
          <div className="flex items-center gap-3 text-slate-400">
            <Settings size={18} className="hover:text-white cursor-pointer" />
            <User size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </nav>

      <main ref={containerRef} className="flex-1 overflow-hidden p-2">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          <ResizablePanel {...leftPanelProps}>
            <div className="flex items-center px-4 h-10 border-b border-[#333] bg-[#333]/30 text-xs text-white">
              <span className="border-b-2 border-white h-full flex items-center font-medium">
                Description
              </span>
            </div>
            <div className="flex-1 p-6 overflow-y-auto text-left max-w-[480px]">
              <p className="text-slate-300 mb-4 leading-relaxed font-sans">
                {currentQuestion.number}.{" "}
                {currentQuestion?.description || "No description available."}
              </p>
            </div>

            <div className="p-3 bg-[#282828] border-t border-[#333]">
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id || i}
                    onClick={() => setCurrentQuestionIndex(i)}
                    className={`w-10 h-10 shrink-0 flex items-center justify-center rounded font-bold transition-all active:scale-95 ${
                      currentQuestionIndex === i
                        ? "bg-blue-600 text-white ring-2 ring-blue-400"
                        : q.isAttempted
                          ? "bg-green-600/20 text-green-500 border border-green-500/50"
                          : "bg-[#3e3e3e] text-slate-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-transparent hover:bg-blue-500/20 transition-colors" />

          <ResizablePanel defaultSize={55}>
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel
                defaultSize={70}
                className="bg-[#282828] rounded-lg border border-[#333] flex flex-col overflow-hidden"
              >
                <div className="h-10 border-b border-[#333] px-4 flex items-center justify-between bg-[#333]/30 text-xs">
                  <span className="text-blue-400 font-mono">Java</span>
                  <HelpCircle size={14} className="text-slate-500" />
                </div>
                <div className="flex-1 relative">
                  <MonacoInstance />
                </div>
              </ResizablePanel>

              <ResizableHandle className="h-2 bg-transparent hover:bg-blue-500/20 transition-colors" />

              <ResizablePanel
                defaultSize={30}
                className="bg-[#282828] rounded-lg border border-[#333] flex flex-col overflow-hidden"
              >
                <div className="flex-1 overflow-hidden">
                  <StudentConsole
                    results={{
                      output: "",
                      executionTime: "",
                    }}
                    isExecuting={running}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      <footer className="h-12 bg-[#282828] border-t border-[#333] px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AutoSaveIndicator />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRunCode}
            disabled={running}
            className="px-4 py-1.5 bg-[#333] hover:bg-[#444] rounded text-xs font-medium text-white transition-colors flex items-center gap-2"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : "Run"}
          </button>
          {/* Wire the manual submit button to the function */}
          <button 
            onClick={() => submitExamPayload(false)}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-bold text-white transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </footer>
    </div>
  );
};