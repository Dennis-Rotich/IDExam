import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import type { ComponentProps } from "react";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { MonacoInstance } from "../../components/Editor/MonacoInstance";
import { LoadingExam } from "../Loading/StudentPageLoading";
import { AutoSaveIndicator } from "../../components/Layout/AutoSaveIndicator";
import { StudentConsole } from "../../components/Student/StudentConsole";
import { Timer } from "../../components/Layout/Timer";
import { Settings, User, HelpCircle, Loader2 } from "lucide-react";
import { useExamStore } from "../../store/useExamStore";
import { EXAM_QUESTIONS } from "../../data/questions";

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

  // FIX 1: Initialize with a safe default (e.g., 20%) so it renders immediately
  const [minPercentage, setMinPercentage] = useState(20);
  const [running, setIsRunning] = useState(false);

  // Derive current question safely
  const currentQuestion = questions[currentQuestionIndex] || EXAM_QUESTIONS[0];

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      //Load the data into the store
      setQuestions(EXAM_QUESTIONS);
      // Explicitly start at the first question
      setCurrentQuestionIndex(0);
    }, 6000);

    // Clean up the timer to prevent memory leaks if the user leaves early
    return () => clearTimeout(timer);
  }, [setQuestions, setCurrentQuestionIndex]);

  useLayoutEffect(() => {
    const calculateMinSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Avoid division by zero
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

  // GUARD CLAUSE
  if (isLoading || !questions || questions.length === 0) {
    return <LoadingExam />;
  }

  const leftPanelProps: Partial<PanelProps> = {
    defaultSize: 45,
    minSize: minPercentage, // This will snap from 20% to calculated % instantly
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
          <Timer
            endsAt={new Date(Date.now() + 3600000).toISOString()}
            onTimeUp={() => {}}
          />
          <div className="flex items-center gap-3 text-slate-400">
            <Settings size={18} className="hover:text-white cursor-pointer" />
            <User size={18} className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </nav>

      <main ref={containerRef} className="flex-1 overflow-hidden p-2">
        {/* FIX 2: Remove the {minPercentage > 0 &&} wrapper */}
        {/* FIX 3: Ensure PanelGroup has h-full explicitly */}
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
          <button className="px-4 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs font-bold text-white transition-colors">
            Submit Exam
          </button>
        </div>
      </footer>
    </div>
  );
};
