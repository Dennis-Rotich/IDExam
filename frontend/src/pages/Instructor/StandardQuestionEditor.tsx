import { Plus, Trash2, CheckCircle2, Circle, Type, CheckSquare } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useQuestionStore } from "../../store/useQuestionStore";

export function StandardQuestionEditor() {
  const { activeQuestion, updateActiveQuestion } = useQuestionStore();

  if (!activeQuestion || activeQuestion.type === "CODING") return null;

  const type = activeQuestion.type;
  const options = activeQuestion.options || [];
  const correctAnswer = activeQuestion.correctAnswer;

  // --- MULTIPLE CHOICE LOGIC ---
  const handleAddOption = () => {
    updateActiveQuestion({ options: [...options, `New Option ${options.length + 1}`] });
  };

  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateActiveQuestion({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    const optionToRemove = options[index];
    const newOptions = options.filter((_, i) => i !== index);
    
    // If they deleted the correct answer, reset the correct answer
    const newCorrectAnswer = correctAnswer === optionToRemove ? undefined : correctAnswer;
    
    updateActiveQuestion({ options: newOptions, correctAnswer: newCorrectAnswer });
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-lg overflow-hidden bg-card/30">
      <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <CheckSquare className="w-3.5 h-3.5" /> Answer Configuration
      </div>

      <div className="p-6 flex-1 space-y-6">
        
        {/* MULTIPLE CHOICE UI */}
        {type === "MULTIPLE_CHOICE" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Define Options & Select Correct Answer</Label>
              <Button onClick={handleAddOption} variant="outline" size="sm" className="h-8 text-xs">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {options.length === 0 ? (
                <div className="text-center p-4 border border-dashed border-border rounded-md text-muted-foreground text-sm">
                  No options added yet.
                </div>
              ) : (
                options.map((opt, idx) => {
                  const isCorrect = correctAnswer === opt;
                  return (
                    <div key={idx} className={`flex items-center gap-3 p-2 rounded-md border ${isCorrect ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border bg-background'}`}>
                      <button 
                        onClick={() => updateActiveQuestion({ correctAnswer: opt })}
                        className="shrink-0 text-muted-foreground hover:text-emerald-500 transition-colors"
                      >
                        {isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5" />}
                      </button>
                      
                      <Input 
                        value={opt}
                        onChange={(e) => handleUpdateOption(idx, e.target.value)}
                        className="flex-1 bg-transparent border-transparent hover:border-border focus-visible:ring-1 shadow-none h-8"
                      />
                      
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveOption(idx)} className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TRUE/FALSE UI */}
        {type === "TRUE_FALSE" && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Select Correct Answer</Label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => updateActiveQuestion({ correctAnswer: true })}
                className={`p-4 rounded-lg border text-center font-medium transition-all ${correctAnswer === true ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-border hover:border-muted-foreground'}`}
              >
                True
              </button>
              <button 
                onClick={() => updateActiveQuestion({ correctAnswer: false })}
                className={`p-4 rounded-lg border text-center font-medium transition-all ${correctAnswer === false ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-border hover:border-muted-foreground'}`}
              >
                False
              </button>
            </div>
          </div>
        )}

        {/* SHORT ANSWER UI */}
        {type === "SHORT_ANSWER" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Type className="w-4 h-4" /> Exact Match Answer
            </Label>
            <Input 
              placeholder="e.g. O(n log n)"
              value={String(correctAnswer || "")}
              onChange={(e) => updateActiveQuestion({ correctAnswer: e.target.value })}
              className="bg-background border-border"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              The student's answer must match this text exactly (case-insensitive usually) to be auto-graded as correct.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}