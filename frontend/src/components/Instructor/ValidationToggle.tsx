import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

interface ValidationToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ValidationToggle({ id, checked, onCheckedChange }: ValidationToggleProps) {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="text-xs text-muted-foreground cursor-pointer">
        {checked ? "Hidden from student" : "Visible to student"}
      </Label>
    </div>
  );
}