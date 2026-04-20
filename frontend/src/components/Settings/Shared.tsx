import { Save, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

// shared components used for the settings/ ui
export function SaveFooter({ label = "Save Changes", onSave, isSaving = false }: any) {
  return (
    <CardFooter className="border-t border-border px-6 py-4">
      <Button 
        onClick={onSave} 
        disabled={isSaving}
        className="bg-foreground text-background hover:bg-foreground/90"
      >
        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        {isSaving ? "Saving..." : label}
      </Button>
    </CardFooter>
  );
}

export function NotifRow({ label, description, checked, onChange, destructive = false }: any) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
      <div className="space-y-0.5">
        <Label className={`text-base ${destructive ? "text-destructive" : "text-foreground"}`}>
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}