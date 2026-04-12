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
import { Settings, User, HelpCircle, Loader2, CheckCircle, Type, List, X } from "lucide-react";
import { useExamStore } from "../../store/useExamStore";
import { EXAM_QUESTIONS } from "../../data/questions";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { getExamApi } from "../../api/exam";
import { startSubmissionApi, runCodeApi, finalizeExamApi, autosaveApi, submitQuestionApi } from "../../api/submission";
import { socket } from "../../lib/socket";
import { toast } from "sonner"; 

export const StudentExam = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const { currentQuestionIndex, questions, isLoading, setQuestions, setCurrentQuestionIndex } = useExamStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [minPercentage, setMinPercentage] = useState(20);
  const [running, setIsRunning] = useState(false);
  const [isGrading, setIsGrading] = useState(false); 
  const [examStatus, setExamStatus] = useState<"in-progress" | "submitting" | "completed" | "failed">("in-progress");
  const [examEndTime, setExamEndTime] = useState(new Date(Date.now() + 3600000).toISOString());
  
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);

  // --- NEW: Client-Side Settings State ---
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });

  const currentQuestion = questions[currentQuestionIndex] || EXAM_QUESTIONS[0];
  const isCodingQuestion = currentQuestion?.type === "CODING" || !currentQuestion?.type;

  // --- Apply Theme Changes ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- 1. Exam Initialization & Sockets ---
  useEffect(() => {
    if (!examId || !user) return; 
    
    socket.connect();
    const onConnect = () => {
      setIsConnected(true);
      socket.emit("join_exam", { role: "student", examId: examId });
    };
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    const initializeExam = async () => {
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
           language: "python" // Default language
        }));
        
        setQuestions(mappedQuestions);
        setCurrentQuestionIndex(0);
      } catch (error: any) {
        console.error("Failed to initialize real exam", error);
        toast.error(error.response?.data?.message || "Failed to load exam environment.");
        setExamStatus("failed"); 
      }
    };

    initializeExam();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [user, examId, setQuestions, setCurrentQuestionIndex]);

  // --- 2. REST API Auto-sync ---
  useEffect(() => {
    if (!currentQuestion || !submissionId) return;

    const syncTimer = setTimeout(async () => {
      let syncData = isCodingQuestion ? (currentQuestion.code || "") : (answers[currentQuestion.id] || "");
      let lang = isCodingQuestion ? (currentQuestion.language || "python") : "text";

      try {
        await autosaveApi(submissionId, currentQuestion.id, lang, syncData);
      } catch (e) {
        console.error("Autosave failed", e);
      }
    }, 2000);

    return () => clearTimeout(syncTimer);
  }, [currentQuestion?.code, answers, currentQuestion?.id, submissionId, isCodingQuestion, currentQuestion?.language]);

  // --- 3. UI Handlers ---
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

  // --- NEW: Language Change Handler ---
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      language: newLang
    };
    setQuestions(updatedQuestions);
  };

  // --- 4. Exam Finalization (Finish Exam) ---
  const submitExamPayload = async (isAutoSubmit: boolean = false) => {
    if (examStatus !== "in-progress") return; 
    setExamStatus("submitting");
    
    try {
      if (user && submissionId) {
        await finalizeExamApi(submissionId);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2500)); 
      }
      setExamStatus("completed");
    } catch (error) {
      console.error("Submission failed:", error);
      setExamStatus("failed");
    }
  };

  const handleTimeUp = useCallback(() => submitExamPayload(true), [examStatus, user, submissionId]);

  // --- 5A. Execution Handler (Dry Run) ---
  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const result = await runCodeApi(currentQuestion.language || "python", currentQuestion.code || "");
      
      if (isConnected && examId) {
        socket.emit("student_execution", {
          examId, 
          studentId: user?.id || socket.id, 
          language: currentQuestion.language || "python",
          output: result.output, 
          isError: result.isError
        });
      }
    } catch (e) {
      console.error("Execution failed", e);
      toast.error("Code execution failed.");
    } finally {
      setIsRunning(false);
    }
  };

  // --- 5B. Submit Question Handler (Real Grading) ---
  const handleSubmitQuestion = async () => {
    if (!submissionId) return;
    setIsGrading(true);
    try {
      const result = await submitQuestionApi(
        submissionId, 
        currentQuestion.id, 
        currentQuestion.language || "python", 
        currentQuestion.code || ""
      );
      
      if (result.success) {
         if (result.status === "Submitted Successfully") {
            toast.success("Code evaluated and saved securely.");
         } else {
            toast.error(`Evaluation Result: ${result.status}`);
         }
      }
    } catch (e) {
      console.error("Grading failed", e);
      toast.error("Failed to grade code. Check your connection.");
    } finally {
      setIsGrading(false);
    }
  };

  // --- 6. Render Logic ---
  if (isLoading || !questions || questions.length === 0) {
     if (examStatus === "failed") {
        return (
          <div className="h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans">
            <div className="bg-card border border-destructive/30 p-8 rounded-lg max-w-md text-center shadow-xl">
              <h2 className="text-2xl font-bold mb-2 text-destructive">Access Denied</h2>
              <p className="text-muted-foreground mb-6 text-sm">Failed to load the exam environment. You may not be assigned to this cohort, or the exam is inactive.</p>
              <Button variant="secondary" onClick={() => window.location.href = "/student/"}>Return to Dashboard</Button>
            </div>
          </div>
        );
     }
     return <LoadingExam />;
  }

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
      
      {/* --- SETTINGS MODAL OVERLAY --- */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Settings size={20} /> Exam Settings
            </h3>
            
            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interface Theme</span>
                <div className="flex bg-muted rounded-md p-1 border border-border">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`px-3 py-1 text-xs font-medium rounded ${theme === "light" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Light
                  </button>
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`px-3 py-1 text-xs font-medium rounded ${theme === "dark" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              
              {/* Future setting placeholder */}
              <div className="flex items-center justify-between opacity-50 cursor-not-allowed">
                <span className="text-sm font-medium">Editor Font Size</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">14px (Locked)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-[#00a3a3] font-bold tracking-tighter">tAhIni</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-foreground">IDExam Engine</span>
        </div>
        <div className="flex items-center gap-6">
          <Timer endsAt={examEndTime} onTimeUp={handleTimeUp} />
          <div className="flex items-center gap-3 text-muted-foreground">
            {/* --- CLICKABLE SETTINGS BUTTON --- */}
            <Settings 
              size={18} 
              className="hover:text-foreground cursor-pointer transition-colors" 
              onClick={() => setIsSettingsOpen(true)}
            />
            <User size={18} className="hover:text-foreground cursor-pointer transition-colors" />
          </div>
        </div>
      </nav>

      <main ref={containerRef} className="flex-1 overflow-hidden p-2 bg-muted/30">
        <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
          
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

          <ResizablePanel defaultSize={55} className="bg-card rounded-lg border border-border flex flex-col overflow-hidden">
            {isCodingQuestion ? (
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={70} className="flex flex-col overflow-hidden">
                  <div className="h-10 border-b border-border px-4 flex items-center justify-between bg-muted/50 text-xs">
                    
                    {/* --- NEW: LANGUAGE SELECTOR DROPDOWN --- */}
                    <div className="flex items-center gap-2">
                      <select 
                        value={currentQuestion.language || "python"}
                        onChange={handleLanguageChange}
                        className="bg-transparent text-primary font-mono text-xs outline-none cursor-pointer hover:bg-muted p-1 rounded border border-transparent hover:border-border transition-colors"
                      >
                        <option value="python">python</option>
                        <option value="javascript">javascript</option>
                      </select>
                    </div>

                    <HelpCircle size={14} className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 relative">
                    <MonacoInstance />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="h-2 bg-transparent hover:bg-border transition-colors" />
                <ResizablePanel defaultSize={30} className="flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-hidden">
                    <StudentConsole results={{ output: "", executionTime: "" }} isExecuting={running || isGrading} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
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
            <>
              <Button variant="secondary" onClick={handleRunCode} disabled={running || isGrading} className="h-8 px-4 text-xs font-medium">
                {running ? <Loader2 size={14} className="animate-spin" /> : "Run"}
              </Button>
              
              <Button variant="outline" onClick={handleSubmitQuestion} disabled={running || isGrading} className="h-8 px-4 text-xs font-medium border-primary text-primary hover:bg-primary/10">
                {isGrading ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
                Submit Code
              </Button>
            </>
          )}
          
          <Button onClick={() => submitExamPayload(false)} className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold ml-4">
            Finish Exam
          </Button>
        </div>
      </footer>
    </div>
  );
};