import { useState } from "react";
import { toast } from "sonner";
import { Accessibility, Sliders, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../ui/card";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { SaveFooter } from "../Shared";
import { updatePreferencesApi } from "../../../api/settings";

export function StudentLearningTab({ user }: { user: any }) {
  // 1. Initialize state from the user's existing preferences (with fallbacks)
  const prefs = user?.preferences || {};
  
  const [highContrast, setHighContrast] = useState(prefs.highContrast || false);
  const [extendedTime, setExtendedTime] = useState(prefs.extendedTime || false);
  const [showProgressBar, setShowProgressBar] = useState(prefs.showProgressBar ?? true);
  const [confirmSubmit, setConfirmSubmit] = useState(prefs.confirmSubmit ?? true);
  const [defaultResultsView, setDefaultResultsView] = useState(prefs.defaultResultsView || "score");
  
  const [isSaving, setIsSaving] = useState(false);

  // 2. Handle the API submission
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Send the exact payload expected by our backend updatePreferences function
      await updatePreferencesApi({
        highContrast,
        extendedTime,
        showProgressBar,
        confirmSubmit,
        defaultResultsView
      });
      
      toast.success("Learning preferences saved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save preferences.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Learning Preferences</CardTitle>
        <CardDescription className="text-muted-foreground">
          Customise how tests and feedback are presented to you.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* --- Accessibility --- */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Accessibility className="h-4 w-4" /> Accessibility
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">High Contrast Mode</Label>
                <p className="text-sm text-muted-foreground">Increases contrast for easier reading during exams.</p>
              </div>
              <Switch checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Extended Time Accommodation</Label>
                <p className="text-sm text-muted-foreground">Request extra time. Subject to instructor approval.</p>
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
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Show Question Progress Bar</Label>
                <p className="text-sm text-muted-foreground">Display a progress indicator while taking a test.</p>
              </div>
              <Switch checked={showProgressBar} onCheckedChange={setShowProgressBar} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-background">
              <div className="space-y-0.5">
                <Label className="text-base text-foreground">Confirm Before Submitting</Label>
                <p className="text-sm text-muted-foreground">Show a confirmation dialog before final submission.</p>
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
              <Label className="text-foreground">Default Results View</Label>
              <Select value={defaultResultsView} onValueChange={setDefaultResultsView}>
                <SelectTrigger className="bg-background border-border text-foreground">
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
      </CardContent>
      
      {/* 3. Drop in our shared Save footer */}
      <SaveFooter onSave={handleSave} isSaving={isSaving} label="Save Preferences" />
    </Card>
  );
}