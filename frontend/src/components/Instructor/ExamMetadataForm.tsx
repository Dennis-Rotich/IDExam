import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ExamMetadata() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-lg border border-border/50">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase">Difficulty</label>
        <Select defaultValue="medium">
          <SelectTrigger className="bg-background"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase">Target Language</label>
        <Select defaultValue="python">
          <SelectTrigger className="bg-background"><SelectValue placeholder="Language" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="python">Python 3</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase">Points / Score</label>
        <Input type="number" placeholder="10" defaultValue={10} className="bg-background" />
      </div>
    </div>
  );
}