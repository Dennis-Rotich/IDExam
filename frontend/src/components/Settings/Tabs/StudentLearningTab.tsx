import { useState } from "react";
import { toast } from "sonner";
import { Accessibility, Sliders, BarChart2, Save, Loader2 } from "lucide-react";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { updatePreferencesApi } from "../../../api/settings";

interface StudentLearningTabProps {
  user: any;
  onUpdateSuccess?: () => void;
}

export function StudentLearningTab({ user, onUpdateSuccess }: StudentLearningTabProps) {
  // Initialize state from the user's existing preferences (with fallbacks)
  const prefs = user?.preferences || {};
  
  const [highContrast, setHighContrast] = useState(prefs.highContrast || false);
  const [extendedTime, setExtendedTime] = useState(prefs.extendedTime || false);
  const [showProgressBar, setShowProgressBar] = useState(prefs.showProgressBar ?? true);
  const [confirmSubmit, setConfirmSubmit] = useState(prefs.confirmSubmit ?? true);
  const [defaultResultsView, setDefaultResultsView] = useState(prefs.defaultResultsView || "score");
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePreferencesApi({
        highContrast,
        extendedTime,
        showProgressBar,
        confirmSubmit,
        defaultResultsView
      });
      
      toast.success("Learning preferences saved successfully!");
      
      // Force global UI refresh so the new preferences persist in context
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if anything changed to enable/disable the save button
  const hasChanges = 
    highContrast !== (prefs.highContrast || false) ||
    extendedTime !== (prefs.extendedTime || false) ||
    showProgressBar !== (prefs.showProgressBar ?? true) ||
    confirmSubmit !== (prefs.confirmSubmit ?? true) ||
    defaultResultsView !== (prefs.defaultResultsView || "score");

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
        <div className="py-3 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Learning Preferences
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* --- Accessibility --- */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Accessibility className="h-4 w-4" /> Accessibility
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
                <div className="space-y-0.5 pr-4">
                  <Label className="text-sm font-medium text-foreground">High Contrast Mode</Label>
                  <p className="text-[11px] text-muted-foreground">Increases contrast for easier reading during exams.</p>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
                <div className="space-y-0.5 pr-4">
                  <Label className="text-sm font-medium text-foreground">Extended Time Accommodation</Label>
                  <p className="text-[11px] text-muted-foreground">Request extra time. Subject to instructor approval.</p>
                </div>
                <Switch checked={extendedTime} onCheckedChange={setExtendedTime} />
              </div>
            </div>
          </div>

          {/* --- Exam Experience --- */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Sliders className="h-4 w-4" /> Exam Experience
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
                <div className="space-y-0.5 pr-4">
                  <Label className="text-sm font-medium text-foreground">Show Question Progress Bar</Label>
                  <p className="text-[11px] text-muted-foreground">Display a progress indicator while taking a test.</p>
                </div>
                <Switch checked={showProgressBar} onCheckedChange={setShowProgressBar} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
                <div className="space-y-0.5 pr-4">
                  <Label className="text-sm font-medium text-foreground">Confirm Before Submitting</Label>
                  <p className="text-[11px] text-muted-foreground">Show a confirmation dialog before final submission.</p>
                </div>
                <Switch checked={confirmSubmit} onCheckedChange={setConfirmSubmit} />
              </div>
            </div>
          </div>

          {/* --- Results Display --- */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <BarChart2 className="h-4 w-4" /> Results Display
            </p>
            <div className="space-y-3">
              <div className="space-y-2 max-w-xs">
                <Label className="text-xs font-medium text-foreground">Default Results View</Label>
                <Select value={defaultResultsView} onValueChange={setDefaultResultsView}>
                  <SelectTrigger className="bg-background border-border text-foreground h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Score Summary</SelectItem>
                    <SelectItem value="breakdown">Question Breakdown</SelectItem>
                    <SelectItem value="comparison">Class Comparison</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !hasChanges} 
            className="h-9 rounded-full px-6 text-xs font-medium"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </div>
  );
}