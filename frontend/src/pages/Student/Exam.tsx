import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { useState, useLayoutEffect, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { MonacoInstance } from "../../components/Editor/MonacoInstance";
import { LoadingExam } from "../Loading/StudentPageLoading";
import { AutoSaveIndicator } from "../../components/Layout/AutoSaveIndicator";
import { StudentConsole } from "../../components/Student/StudentConsole";
import { Timer } from "../../components/Layout/Timer";
import { Settings, User, HelpCircle, Loader2, CheckCircle, Type, List } from "lucide-react";
import { useExamStore } from "../../store/useExamStore";
import { EXAM_QUESTIONS } from "../../data/questions";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { getExamApi } from "../../api/exam";
import { startSubmissionApi, submitExamApi } from "../../api/submission";
import { socket } from "../../lib/socket";

export const StudentExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const { currentQuestionIndex, questions, isLoading, setQuestions, setCurrentQuestionIndex } = useExamStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [minPercentage, setMinPercentage] = useState(20);
  const [running, setIsRunning] = useState(false);
  const [examStatus, setExamStatus] = useState<"in-progress" | "submitting" | "completed" | "failed">("in-progress");
  const [examEndTime, setExamEndTime] = useState(new Date(Date.now() + 3600000).toISOString());
  // Track the actual database submission ID
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  // Track local answers for non-coding questions
  const [answers, setAnswers] = useState<Record<string, any>>({});
  // Socket connection state
  const [isConnected, setIsConnected] = useState(false);

  const currentQuestion = questions[currentQuestionIndex] || EXAM_QUESTIONS[0];
  const isCodingQuestion = currentQuestion?.type === "CODING" || !currentQuestion?.type;

  // --- 1. exam initialization and socket connection ---
  useEffect(() => {
    if (!examId) return;
    // Connect to WebSocket
    socket.connect();
    
    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join_exam", { role: "student", examId: examId });
    };

    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Fetch initial exam data
    const initializeExam = async () => {
      if (user && examId) {
        try {
          const fetchedExam = await getExamApi(examId);
          const submission = await startSubmissionApi(examId);
          
          setSubmissionId(submission.submission._id);
          
          if (fetchedExam.exam.durationInMinutes) {
             setExamEndTime(new Date(Date.now() + fetchedExam.exam.durationInMinutes * 60000).toISOString());
          }
          
          const mappedQuestions = fetchedExam.exam.questions.map((q: any, i: number) => ({
             id: q._id,
             number: i + 1,
             title: q.title,
             description: q.description,
             type: q.type || "CODING", 
             options: q.options || [],
             pointsWeight: q.pointsWeight || 10,
             isAttempted: false,
             difficulty: q.difficulty,
             code: q.starterCode?.['python'] || "",
             language: "python"
          }));
          
          setQuestions(mappedQuestions);
          setCurrentQuestionIndex(0);
          return;
        } catch (error) {
          console.error("Failed to initialize real exam", error);
        }
      }
      
      // Fallback Dummy Data
      const timer = setTimeout(() => {
        setQuestions(EXAM_QUESTIONS);
        setCurrentQuestionIndex(0);
      }, 1000);
      return () => clearTimeout(timer);
    };

    initializeExam();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [user, examId, setQuestions, setCurrentQuestionIndex]);

  // --- 2. websocket auto-sync ---
  // Debounce the code/answer changes to emit every 1000ms instead of every keystroke
  useEffect(() => {
    if (!isConnected || !currentQuestion || !examId) return;

    const syncTimer = setTimeout(() => {
      let syncData = "";
      
      if (isCodingQuestion) {
        syncData = currentQuestion.code || "";
      } else {
        const ans = answers[currentQuestion.id];
        // Formatting standard questions so the teacher sees it nicely on the dashboard
        syncData = `[${currentQuestion.type}] Answered: ${ans !== undefined ? ans : "Not answered yet"}`;
      }

      socket.emit("code_full_sync", { examId, code: syncData });
      
    }, 1000);

    return () => clearTimeout(syncTimer);
  }, [currentQuestion?.code, answers, currentQuestion?.id, isConnected, examId, isCodingQuestion]);

  // --- 3. UI LAYOUT CALCULATION ---
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

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const submitExamPayload = async (isAutoSubmit: boolean = false) => {
    if (examStatus !== "in-progress") return; 
    setExamStatus("submitting");
    
    try {
      if (user && submissionId) {
        await submitExamApi(submissionId);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2500));
      }
      setExamStatus("completed");
    } catch (error) {
      console.error("Submission failed:", error);
      setExamStatus("failed");
    }
  };

  const handleTimeUp = useCallback(() => submitExamPayload(true), [examStatus]);

  // --- 4. EXECUTION HANDLER ---
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Simulate code execution delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, this comes from your compiler/Piston API response
      const mockIsError = false; 
      const mockOutput = "Execution finished successfully.";

      // Emit execution result to the teacher's Live Proctoring dashboard
      if (isConnected && examId) {
        socket.emit("student_execution", {
          examId: examId,
          studentId: user?.id || socket.id,
          language: currentQuestion.language || "python",
          output: mockOutput,
          isError: mockIsError
        });
      }

    } finally {
      setIsRunning(false);
    }
  };


  if (isLoading || !questions || questions.length === 0) return <LoadingExam />;

  if (examStatus === "submitting" || examStatus === "completed") {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans">
        {examStatus === "submitting" ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-semibold">Submitting Exam...</h2>
            <p className="text-muted-foreground mt-2 text-sm">Please do not close this tab or disconnect your network.</p>
          </>
        ) : (
          <div className="bg-card border border-border p-8 rounded-lg max-w-md text-center shadow-xl">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Submission Successful</h2>
            <p className="text-muted-foreground mb-6 text-sm">Your exam has been securely transmitted and recorded.</p>
            <Button variant="secondary" onClick={() => window.location.href = "/student/"}>Return to Dashboard</Button>
          </div>
        )}
      </div>
    );
  }

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
          
          {/* LEFT PANEL: Description & Question Navigator */}
          <ResizablePanel defaultSize={45} minSize={minPercentage} className="flex flex-col bg-card rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-muted/50 text-xs">
              <span className="border-b-2 border-primary h-full flex items-center font-medium">Description</span>
              <span className="text-muted-foreground font-medium">{currentQuestion.pointsWeight} Pts</span>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto text-left">
              <h2 className="text-lg font-bold mb-4">{currentQuestion.title}</h2>
              <p className="text-foreground mb-4 leading-relaxed font-sans whitespace-pre-wrap">
                {currentQuestion?.description || "No description available."}
              </p>
            </div>

            {/* Question Navigator Footer */}
            <div className="p-3 bg-card border-t border-border">
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => {
                  const hasAnswer = q.type === 'CODING' ? q.isAttempted : answers[q.id] !== undefined;
                  return (
                    <button
                      key={q.id || i}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-10 h-10 shrink-0 flex items-center justify-center rounded font-bold transition-all active:scale-95 ${
                        currentQuestionIndex === i
                          ? "bg-primary text-primary-foreground"
                          : hasAnswer
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/50"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle className="w-2 bg-transparent hover:bg-border transition-colors" />

          {/* RIGHT PANEL: Dynamic Input Area */}
          <ResizablePanel defaultSize={55} className="bg-card rounded-lg border border-border flex flex-col overflow-hidden">
            {isCodingQuestion ? (
              // --- CODING UI ---
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={70} className="flex flex-col overflow-hidden">
                  <div className="h-10 border-b border-border px-4 flex items-center justify-between bg-muted/50 text-xs">
                    <span className="text-primary font-mono">{currentQuestion.language || "python"}</span>
                    <HelpCircle size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 relative">
                    <MonacoInstance />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="h-2 bg-transparent hover:bg-border transition-colors" />
                <ResizablePanel defaultSize={30} className="flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-hidden">
                    <StudentConsole results={{ output: "", executionTime: "" }} isExecuting={running} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              // --- STANDARD QUESTION UI (MCQ / Short Answer) ---
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="h-10 border-b border-border px-4 flex items-center bg-muted/50 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {currentQuestion.type === "MULTIPLE_CHOICE" ? <><List className="w-3.5 h-3.5 mr-2" /> Multiple Choice</> : 
                   currentQuestion.type === "TRUE_FALSE" ? <><List className="w-3.5 h-3.5 mr-2" /> True / False</> : 
                   <><Type className="w-3.5 h-3.5 mr-2" /> Short Answer</>}
                </div>
                
                <div className="p-8 max-w-2xl">
                  {currentQuestion.type === "MULTIPLE_CHOICE" && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((opt: string, idx: number) => (
                        <label 
                          key={idx} 
                          className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${
                            answers[currentQuestion.id] === idx 
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300" 
                              : "bg-background border-border hover:bg-muted/50 text-foreground"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={currentQuestion.id} 
                            className="w-4 h-4 accent-blue-600"
                            checked={answers[currentQuestion.id] === idx}
                            onChange={() => handleAnswerChange(idx)}
                          />
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "TRUE_FALSE" && (
                    <div className="space-y-3">
                      {["True", "False"].map((opt) => (
                        <label 
                          key={opt} 
                          className={`flex items-center gap-4 p-4 border rounded-md cursor-pointer transition-colors ${
                            answers[currentQuestion.id] === (opt === "True") 
                              ? "bg-blue-500/10 border-blue-500/50 text-blue-700 dark:text-blue-300" 
                              : "bg-background border-border hover:bg-muted/50 text-foreground"
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={currentQuestion.id} 
                            className="w-4 h-4 accent-blue-600"
                            checked={answers[currentQuestion.id] === (opt === "True")}
                            onChange={() => handleAnswerChange(opt === "True")}
                          />
                          <span className="text-sm font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {currentQuestion.type === "SHORT_ANSWER" && (
                    <textarea
                      className="w-full min-h-[250px] p-4 bg-background border border-border rounded-md text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 resize-none shadow-sm"
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}
          </ResizablePanel>

        </ResizablePanelGroup>
      </main>

      <footer className="h-12 bg-card border-t border-border px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AutoSaveIndicator />
        </div>
        <div className="flex gap-2">
          {isCodingQuestion && (
            <Button variant="secondary" onClick={handleRunCode} disabled={running} className="h-8 px-4 text-xs font-medium">
              {running ? <Loader2 size={14} className="animate-spin" /> : "Run"}
            </Button>
          )}
          <Button onClick={() => submitExamPayload(false)} className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
            Submit Exam
          </Button>
        </div>
      </footer>
    </div>
  );
};