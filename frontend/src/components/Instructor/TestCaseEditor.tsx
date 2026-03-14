import { Trash } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ValidationToggle } from "./ValidationToggle";

interface TestCaseProps {
  id: number;
  input: string;
  output: string;
  isHidden: boolean;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: string, value: string | boolean) => void;
}

export function TestCaseEditor({ id, input, output, isHidden, onRemove, onUpdate }: TestCaseProps) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-card shadow-sm">
      <div className="flex-1 space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Input (stdin)</label>
        <Textarea 
          value={input}
          onChange={(e) => onUpdate(id, "input", e.target.value)}
          className="font-mono text-sm h-24 resize-none bg-muted/20" 
          placeholder="e.g. 5\n1 2 3 4 5"
        />
      </div>
      <div className="flex-1 space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expected Output (stdout)</label>
        <Textarea 
          value={output}
          onChange={(e) => onUpdate(id, "output", e.target.value)}
          className="font-mono text-sm h-24 resize-none bg-muted/20" 
          placeholder="e.g. 15"
        />
      </div>
      <div className="flex flex-col items-center gap-3 pt-6">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => onRemove(id)}>
          <Trash className="w-4 h-4" />
        </Button>
        <ValidationToggle 
          id={`hidden-${id}`} 
          checked={isHidden} 
          onCheckedChange={(val) => onUpdate(id, "isHidden", val)} 
        />
      </div>
    </div>
  );
}