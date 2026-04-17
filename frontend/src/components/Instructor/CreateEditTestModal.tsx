import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { type Exam } from "../../types/exam";

interface CreateEditTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testToEdit?: Exam | null; 
  onSave: (testData: Partial<Exam>) => void;
}

export function CreateEditTestModal({ isOpen, onClose, testToEdit, onSave }: CreateEditTestModalProps) {
  
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    examCode: "",
    durationInMinutes: 60,
    availableFrom: "",
    availableUntil: "",
    status: "draft",
    assignedCohorts: "", // Stored as a string for easy editing in the input
  });

  const formatForInput = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 16); 
  };

  useEffect(() => {
    if (testToEdit) {
      setFormData({
        title: testToEdit.title || "",
        courseCode: testToEdit.courseCode || "",
        examCode: testToEdit.examCode || "",
        durationInMinutes: testToEdit.durationInMinutes || 60,
        availableFrom: formatForInput(testToEdit.availableFrom),
        availableUntil: formatForInput(testToEdit.availableUntil),
        status: testToEdit.status || "draft",
        // Convert the array from the database into a comma-separated string for the UI
        assignedCohorts: testToEdit.assignedCohorts?.join(", ") || "", 
      });
    }
  }, [testToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...testToEdit,
      ...formData,
      availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : undefined,
      availableUntil: formData.availableUntil ? new Date(formData.availableUntil).toISOString() : undefined,
      // Convert the comma-separated string back into a clean array for the backend
      assignedCohorts: formData.assignedCohorts
        .split(",")
        .map((cohort) => cohort.trim())
        .filter(Boolean),
    };
    
    onSave(payload);
    onClose();
  };

  if (!testToEdit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground p-0 overflow-hidden shadow-lg">
        
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/10">
          <DialogTitle className="text-lg font-bold">
            Edit Examination Settings
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Title</Label>
              <Input 
                id="title" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Code</Label>
                <Input 
                  id="courseCode" 
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                  className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md uppercase" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examCode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam Code</Label>
                <Input 
                  id="examCode" 
                  value={formData.examCode}
                  onChange={(e) => setFormData({ ...formData, examCode: e.target.value.toUpperCase() })}
                  className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md uppercase font-mono" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Visibility</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="bg-background border-border h-9 text-sm rounded-md focus:ring-1 focus:ring-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignedCohorts" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
                  <span>Assigned Cohorts</span>
                  <span className="text-[10px] text-muted-foreground/50 lowercase font-normal">(Comma separated)</span>
                </Label>
                <Input 
                  id="assignedCohorts" 
                  placeholder="e.g. CS301, IT-YEAR-3"
                  value={formData.assignedCohorts}
                  onChange={(e) => setFormData({ ...formData, assignedCohorts: e.target.value.toUpperCase() })}
                  className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md uppercase" 
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between">
                  <span>Available Window (Optional)</span>
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <Input 
                    type="datetime-local" 
                    value={formData.availableFrom}
                    onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                    className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md w-full" 
                    title="Available From"
                  />
                  <span className="text-muted-foreground hidden sm:block">to</span>
                  <Input 
                    type="datetime-local" 
                    value={formData.availableUntil}
                    onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
                    className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md w-full" 
                    title="Available Until"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration (Mins)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  required
                  min={1}
                  value={formData.durationInMinutes}
                  onChange={(e) => setFormData({ ...formData, durationInMinutes: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border w-24 h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" 
                />
              </div>
            </div>

          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="bg-muted/50 hover:bg-muted text-foreground rounded-full px-5 h-9 text-sm">
              Cancel
            </Button>
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 h-9 text-sm">
              Save Changes
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}