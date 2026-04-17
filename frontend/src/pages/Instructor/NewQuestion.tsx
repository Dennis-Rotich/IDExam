import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Save, ArrowLeft, AlignLeft, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "sonner";

import { useQuestionStore } from "../../store/useQuestionStore";
import { ExamMetadata } from "../../components/Instructor/ExamMetadataForm";
import { CodeSolutionEditor } from "../../components/Instructor/CodeSolutionEditor";
import { TestCaseManager } from "../../components/Instructor/TestCaseManager";
import { StandardQuestionEditor } from "./StandardQuestionEditor";
import { runCodeApi } from "../../api/submission";
import { createQuestionApi } from "../../api/question"; 

export function NewQuestion() {
  const navigate = useNavigate();
  const { activeQuestion, createDraft, updateActiveQuestion } = useQuestionStore();

  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    createDraft();
  }, [createDraft]);

  if (!activeQuestion) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Initializing Editor Environment...
      </div>
    );
  }

  // --- API HANDLER: PUBLISH QUESTION ---
  const handleSave = async () => {
    if (!activeQuestion.title?.trim()) return toast.error("Question title is required.");
    if (!activeQuestion.description?.trim()) return toast.error("Problem description is required.");
    if (!activeQuestion.type) return toast.error("Question type is required.");

    // Validate Coding specific requirements
    if (activeQuestion.type === "CODING") {
      if (!activeQuestion.testCases || activeQuestion.testCases.length === 0) {
        return toast.error("Coding questions must have at least one test case.");
      }
      if (!activeQuestion.referenceSolution) {
        return toast.error("Please provide a reference solution.");
      }
    }

    // Validate Non-Coding specific requirements
    if (activeQuestion.type === "MULTIPLE_CHOICE") {
      if (!activeQuestion.options || activeQuestion.options.length < 2) return toast.error("MCQs require at least two options.");
      if (activeQuestion.correctAnswer === undefined) return toast.error("Please select a correct answer.");
    }
    if (activeQuestion.type === "TRUE_FALSE" || activeQuestion.type === "SHORT_ANSWER") {
      if (activeQuestion.correctAnswer === undefined || activeQuestion.correctAnswer === "") return toast.error("Please provide a correct answer.");
    }

    try {
      setIsSaving(true);
      
      const payload = {
        title: activeQuestion.title,
        description: activeQuestion.description,
        type: activeQuestion.type,
        difficulty: activeQuestion.difficulty || "Medium",
        topic: activeQuestion.topic || "Algorithms",
        tags: activeQuestion.tags || [],
        pointsWeight: activeQuestion.pointsWeight || 10,
        
        ...(activeQuestion.type === "CODING" && {
          allowedLanguages: activeQuestion.allowedLanguages || ["python", "javascript", "cpp"],
          referenceSolution: activeQuestion.referenceSolution,
          testCases: activeQuestion.testCases,
          timeLimitMs: activeQuestion.timeLimitMs || 2000,
          memoryLimitKb: activeQuestion.memoryLimitKb || 256000,
        }),
        
        ...(activeQuestion.type !== "CODING" && {
          options: activeQuestion.options || [],
          correctAnswer: activeQuestion.correctAnswer,
        }),
      };

      await createQuestionApi(payload);
      toast.success("Question published successfully!");
      navigate("/instructor/questions");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to publish question.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    // ... (Keep your existing handleRun logic here)
  };

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2 animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        {/* ... (Keep your existing Header input here) ... */}
        <div className="flex items-center gap-4 w-full sm:w-1/2">
          <Link to="/instructor/questions">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Input 
            className="text-2xl font-bold h-12 border-transparent shadow-none px-2 focus-visible:ring-1 focus-visible:ring-border bg-transparent text-foreground placeholder:text-muted-foreground/50 w-full" 
            placeholder="Untitled Question..." 
            value={activeQuestion.title || ""}
            onChange={(e) => updateActiveQuestion({ title: e.target.value })}
            autoFocus
          />
        </div>

        <div className="flex items-center gap-2">
          {/* ONLY show 'Run' button if it's a coding question */}
          {activeQuestion.type === "CODING" && (
            <Button variant="secondary" onClick={handleRun} disabled={isRunning || isSaving} className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5">
              {isRunning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? "Running..." : "Run"}
            </Button>
          )}

          <Button onClick={handleSave} disabled={isSaving || isRunning} className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-full px-5">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Publish
          </Button>
        </div>
      </div>

      <ExamMetadata />

      {/* EDITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Left Side: Markdown Description (Always Visible) */}
        <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card/30">
          <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <AlignLeft className="w-3.5 h-3.5" /> Problem Description
          </div>
          <Textarea 
            className="flex-1 w-full border-0 rounded-none focus-visible:ring-0 resize-none p-5 bg-transparent text-foreground placeholder:text-muted-foreground/50 leading-relaxed text-sm" 
            placeholder="Write your problem statement here. Markdown is supported..."
            value={activeQuestion.description || ""}
            onChange={(e) => updateActiveQuestion({ description: e.target.value })}
          />
        </div>

        {/* Right Side: DYNAMIC EDITOR BASED ON TYPE */}
        {activeQuestion.type === "CODING" ? (
          <CodeSolutionEditor />
        ) : (
          <StandardQuestionEditor />
        )}
      </div>

      {/* Test Case Manager: Only renders internally if activeQuestion.type === "CODING" */}
      {activeQuestion.type === "CODING" && <TestCaseManager />}

    </div>
  );
}