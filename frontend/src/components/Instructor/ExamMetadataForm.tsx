import { Settings2, Hash, BookOpen, Tag, Target } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select";
import { useQuestionStore } from "../../store/useQuestionStore";
import { type QuestionType, type QuestionDifficulty } from "../../types/question";

export function ExamMetadata() {
  const { activeQuestion, updateActiveQuestion } = useQuestionStore();

  if (!activeQuestion) return null;

  return (
    <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden">
      <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Settings2 className="w-3.5 h-3.5" /> Question Configuration
      </div>
      
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        
        {/* 1. QUESTION TYPE SELECTOR (This triggers the UI swap!) */}
        <div className="space-y-2 xl:col-span-1">
          <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" /> Question Type
          </Label>
          <Select 
            value={activeQuestion.type || "CODING"} 
            onValueChange={(value: QuestionType) => {
              // When changing types, we reset the correctAnswer to avoid type mismatch bugs
              updateActiveQuestion({ 
                type: value,
                correctAnswer: undefined 
              });
            }}
          >
            <SelectTrigger className="bg-background border-border h-9 text-sm">
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CODING">Coding Problem</SelectItem>
              <SelectItem value="MULTIPLE_CHOICE">Multiple Choice</SelectItem>
              <SelectItem value="TRUE_FALSE">True / False</SelectItem>
              <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. DIFFICULTY SELECTOR */}
        <div className="space-y-2 xl:col-span-1">
          <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-muted-foreground" /> Difficulty
          </Label>
          <Select 
            value={activeQuestion.difficulty || "Medium"} 
            onValueChange={(value: QuestionDifficulty) => updateActiveQuestion({ difficulty: value })}
          >
            <SelectTrigger className="bg-background border-border h-9 text-sm">
              <SelectValue placeholder="Difficulty..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3. POINTS WEIGHT */}
        <div className="space-y-2 xl:col-span-1">
          <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-muted-foreground" /> Points Value
          </Label>
          <Input 
            type="number" 
            min={1}
            value={activeQuestion.pointsWeight || 10}
            onChange={(e) => updateActiveQuestion({ pointsWeight: Number(e.target.value) })}
            className="bg-background border-border h-9 text-sm"
          />
        </div>

        {/* 4. TOPIC */}
        <div className="space-y-2 xl:col-span-1">
          <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" /> Topic
          </Label>
          <Input 
            type="text" 
            placeholder="e.g. Data Structures"
            value={activeQuestion.topic || ""}
            onChange={(e) => updateActiveQuestion({ topic: e.target.value })}
            className="bg-background border-border h-9 text-sm"
          />
        </div>

        {/* 5. TAGS (Comma separated) */}
        <div className="space-y-2 xl:col-span-1">
          <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" /> Tags
          </Label>
          <Input 
            type="text" 
            placeholder="e.g. Arrays, Pointers"
            value={activeQuestion.tags?.join(", ") || ""}
            onChange={(e) => {
              // Convert comma-separated string back to array, trimming whitespace
              const tagsArray = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
              updateActiveQuestion({ tags: tagsArray });
            }}
            className="bg-background border-border h-9 text-sm"
          />
        </div>

      </div>
    </div>
  );
}