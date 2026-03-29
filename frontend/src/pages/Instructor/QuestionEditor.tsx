import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Save, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

import { useQuestionStore } from "../../store/useQuestionStore";
import { ExamMetadata } from "../../components/Instructor/ExamMetadataForm";
import { CodeSolutionEditor } from "../../components/Instructor/CodeSolutionEditor";
import { TestCaseManager } from "../../components/Instructor/TestCaseManager";

export function QuestionEditor() {
  // IMPORTANT: The variable name here ('id') MUST match your route definition exactly.
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const { 
    activeQuestion, 
    setActiveQuestion, 
    updateActiveQuestion, 
    saveActiveQuestion,
    questions // <-- Pulling this in just to check if the store is populated
  } = useQuestionStore();

  useEffect(() => {
    if (id) {
      setActiveQuestion(id);
    }
    // Note: I removed the cleanup function here to prevent Strict Mode from wiping the state.
  }, [id, setActiveQuestion]);

  // Handle Loading State
  if (!activeQuestion && questions.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        Loading Question Environment...
      </div>
    );
  }

  // Handle "Not Found" State (Helps you debug if the ID is wrong)
  if (!activeQuestion && questions.length > 0) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-muted-foreground gap-4">
        <p>Could not find a question with ID: <strong className="text-foreground">{id}</strong></p>
        <Link to="/instructor/questions">
          <Button variant="outline" className="border-border">Return to Question Bank</Button>
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    saveActiveQuestion();
    navigate("/instructor/questions");
  };

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-1/2">
          <Link to="/instructor/questions">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Input 
            className="text-2xl font-bold h-12 border-transparent shadow-none px-2 focus-visible:ring-1 bg-transparent text-foreground placeholder:text-muted-foreground/50 w-full" 
            placeholder="Untitled Question..." 
            value={activeQuestion?.title}
            onChange={(e) => updateActiveQuestion({ title: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-border hover:bg-muted text-foreground h-9">
            <Play className="w-4 h-4 mr-2" /> Run Solution
          </Button>
          <Button 
            className="bg-foreground text-background hover:bg-foreground/90 h-9"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </div>

      {/* Wired Metadata Form */}
      <ExamMetadata />

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px] text-left">
        {/* Markdown Description Box */}
        <Card className="flex flex-col h-full bg-card border-border shadow-sm">
          <CardHeader className="py-3 border-b border-border bg-muted/30">
            <CardTitle className="text-sm font-medium text-foreground">Problem Description (Markdown)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea 
              className="w-full h-full min-h-[400px] border-0 rounded-none focus-visible:ring-0 resize-none p-4 bg-transparent text-foreground placeholder:text-muted-foreground leading-relaxed" 
              placeholder="Write your problem statement here. Markdown is supported..."
              value={activeQuestion?.description || ""}
              onChange={(e) => updateActiveQuestion({ description: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Wired Code Solution Editor */}
        <CodeSolutionEditor />
      </div>

      {/* Wired Test Case Manager */}
      <TestCaseManager />
    </div>
  );
}