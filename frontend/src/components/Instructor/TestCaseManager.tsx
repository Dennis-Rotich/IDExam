import { useState } from "react";
import { Plus, Trash2, Eye, EyeOff, Code } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { useQuestionStore } from "../../store/useQuestionStore";
import { type TestCase } from "../../types/question";
import { toast } from "sonner";

export function TestCaseManager() {
  const { activeQuestion, updateActiveQuestion } = useQuestionStore();
  const testCases = activeQuestion?.testCases || [];

  // Local state for the "New Test Case" form
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [points, setPoints] = useState(2);

  const handleAddTestCase = () => {
    if (!newInput.trim() || !newOutput.trim()) {
      return toast.error("Input and Expected Output are required.");
    }

    const newTestCase: TestCase = {
      input: newInput,
      expectedOutput: newOutput,
      isHidden,
      points,
    };

    updateActiveQuestion({ testCases: [...testCases, newTestCase] });

    // Reset form
    setNewInput("");
    setNewOutput("");
    setIsHidden(false);
    setPoints(2);
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedTestCases = testCases.filter((_, idx) => idx !== indexToDelete);
    updateActiveQuestion({ testCases: updatedTestCases });
  };

  // Only show test cases for CODING questions
  if (activeQuestion?.type && activeQuestion.type !== "CODING") {
    return null; 
  }

  return (
    <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden">
      <div className="py-2.5 px-4 border-b border-border bg-muted/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Code className="w-3.5 h-3.5" /> Test Cases & Evaluation
      </div>

      <div className="p-6 space-y-8">
        {/* ADD NEW TEST CASE FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Input (stdin)</Label>
            <Textarea 
              value={newInput}
              onChange={(e) => setNewInput(e.target.value)}
              placeholder="e.g. [1, 2, 3]\n5"
              className="bg-background border-border font-mono text-sm h-24 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Expected Output (stdout)</Label>
            <Textarea 
              value={newOutput}
              onChange={(e) => setNewOutput(e.target.value)}
              placeholder="e.g. true"
              className="bg-background border-border font-mono text-sm h-24 resize-none"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2 flex items-end justify-between bg-muted/20 p-4 rounded-lg border border-border mt-2">
            <div className="flex gap-8">
              <div className="flex items-center space-x-2">
                <Switch id="hidden-mode" checked={isHidden} onCheckedChange={setIsHidden} />
                <Label htmlFor="hidden-mode" className="text-sm font-medium cursor-pointer">
                  Hidden Test Case
                </Label>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Points Value</Label>
                <Input 
                  type="number" 
                  value={points} 
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="w-20 h-8 bg-background"
                  min={0}
                />
              </div>
            </div>
            <Button onClick={handleAddTestCase} size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Test Case
            </Button>
          </div>
        </div>

        {/* LIST OF ADDED TEST CASES */}
        {testCases.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground border-b border-border pb-2">Configured Test Cases ({testCases.length})</h4>
            <div className="grid grid-cols-1 gap-3">
              {testCases.map((tc, idx) => (
                <div key={idx} className="flex items-start justify-between bg-background border border-border p-3 rounded-md">
                  <div className="flex-1 grid grid-cols-2 gap-4 font-mono text-xs">
                    <div>
                      <span className="text-muted-foreground uppercase text-[10px] block mb-1">Input</span>
                      <span className="text-foreground whitespace-pre-wrap">{tc.input}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground uppercase text-[10px] block mb-1">Expected Output</span>
                      <span className="text-emerald-500 whitespace-pre-wrap">{tc.expectedOutput}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-4 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium">{tc.points} pts</span>
                      {tc.isHidden ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-500"><EyeOff className="w-3 h-3" /> Hidden</span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Eye className="w-3 h-3" /> Visible</span>
                      )}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(idx)} className="text-destructive hover:bg-destructive/10 h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}