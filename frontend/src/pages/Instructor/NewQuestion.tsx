import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, Save, ArrowLeft, AlignLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

import { useQuestionStore } from "../../store/useQuestionStore";
import { ExamMetadata } from "../../components/Instructor/ExamMetadataForm";
import { CodeSolutionEditor } from "../../components/Instructor/CodeSolutionEditor";
import { TestCaseManager } from "../../components/Instructor/TestCaseManager";

export function NewQuestion() {
  const navigate = useNavigate();
  const { activeQuestion, createDraft, updateActiveQuestion, saveActiveQuestion } = useQuestionStore();

  // Force a clean draft every time this page mounts
  useEffect(() => {
    createDraft();
  }, [createDraft]);

  if (!activeQuestion) {
    return <div className="flex h-[50vh] items-center justify-center text-muted-foreground">Initializing Editor Environment...</div>;
  }

  const handleSave = () => {
    saveActiveQuestion();
    navigate("/instructor/questions");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 text-foreground text-left px-2 pt-4">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
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
          <Button variant="secondary" className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5">
            <Play className="w-4 h-4 mr-2" /> Run
          </Button>
          <Button className="bg-foreground text-background hover:bg-foreground/90 h-9 rounded-full px-5" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Publish
          </Button>
        </div>
      </div>

      {/* METADATA FORM (Should be flattened internally in your components) */}
      <ExamMetadata />

      {/* EDITOR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
        {/* Markdown Description Box - Flattened */}
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

        {/* Code Solution Editor */}
        <CodeSolutionEditor />
      </div>

      {/* Test Case Manager */}
      <TestCaseManager />
    </div>
  );
}