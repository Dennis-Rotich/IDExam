import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner"; 
import { useQuestionStore } from "../../store/useQuestionStore";
import { ExamMetadata } from "../../components/Instructor/ExamMetadataForm";
import { CodeSolutionEditor } from "../../components/Instructor/CodeSolutionEditor";
import { TestCaseManager } from "../../components/Instructor/TestCaseManager";
import { getQuestionApi, updateQuestionApi, createQuestionApi } from "../../api/question";

export function QuestionEditor() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    activeQuestion, 
    setActiveQuestion, 
    updateActiveQuestion, 
    saveActiveQuestion,
    setQuestions, // Need this to inject the fetched question if store is empty
    questions
  } = useQuestionStore();

  // 1. HARD-REFRESH PROOF LOADING LOGIC
  useEffect(() => {
    const initializeQuestion = async () => {
      if (!id) return;

      // Try setting it from the local store first
      setActiveQuestion(id);
      
      // If setting it failed (activeQuestion is still null), it means the store is empty
      // We must fetch it directly from the database.
      const currentStoreState = useQuestionStore.getState();
      if (!currentStoreState.activeQuestion && id !== "new") {
        try {
          setIsFetching(true);
          const dbQuestion = await getQuestionApi(id); 
          
          if (dbQuestion) {
            // Inject the missing question into the store, then activate it
            setQuestions([...questions, dbQuestion]);
            setActiveQuestion(id);
          }
        } catch (error) {
          toast.error("Failed to fetch question from server.");
        } finally {
          setIsFetching(false);
        }
      }
    };

    initializeQuestion();
  }, [id, setActiveQuestion, setQuestions, questions]);

  // Handle Loading State (Now accounts for API fetching)
  if (isFetching || (!activeQuestion && questions.length === 0)) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Loading Question Environment...</p>
      </div>
    );
  }

  // Handle "Not Found" State
  if (!activeQuestion && !isFetching) {
    return (
      <div className="flex flex-col h-[50vh] items-center justify-center text-muted-foreground gap-4">
        <p>Could not find a question with ID: <strong className="text-foreground">{id}</strong></p>
        <Link to="/instructor/questions">
          <Button variant="outline" className="border-border">Return to Question Bank</Button>
        </Link>
      </div>
    );
  }

  // 2. REAL MONGODB SAVING LOGIC
  const handleSave = async () => {
    if (!activeQuestion) return;

    try {
      setIsSaving(true);
      
      // Check if it's a new draft or an existing MongoDB document
      const isNew = activeQuestion._id === "draft" || activeQuestion._id?.startsWith("temp");

      if (isNew) {
        await createQuestionApi({ ...activeQuestion, _id: undefined });
      } else {
        await updateQuestionApi(activeQuestion._id as string, activeQuestion);
      }

      // Update the local Zustand store so the UI feels instant
      saveActiveQuestion(); 
      toast.success("Question saved successfully!");
      navigate("/instructor/questions");
    } catch (error) {
      toast.error("Failed to save changes to the database.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
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
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <ExamMetadata />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px] text-left">
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
        <CodeSolutionEditor />
      </div>

      <TestCaseManager />
    </div>
  );
}