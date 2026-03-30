import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CreateEditTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testToEdit?: any | null; 
  onSave: (testData: any) => void;
}

export function CreateEditTestModal({ isOpen, onClose, testToEdit, onSave }: CreateEditTestModalProps) {
  const isEditing = !!testToEdit;

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    durationMinutes: 60,
    dueDate: "",
    status: "draft",
  });

  useEffect(() => {
    if (testToEdit) {
      setFormData({
        title: testToEdit.title,
        subject: testToEdit.subject,
        durationMinutes: testToEdit.durationMinutes,
        dueDate: testToEdit.dueDate,
        status: testToEdit.status,
      });
    } else {
      setFormData({ title: "", subject: "", durationMinutes: 60, dueDate: "", status: "draft" });
    }
  }, [testToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...testToEdit, ...formData });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] bg-card border-border text-foreground p-0 overflow-hidden shadow-lg">
        
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/10">
          <DialogTitle className="text-lg font-bold">
            {isEditing ? "Edit Examination Settings" : "Create New Examination"}
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
                placeholder="e.g. CS201 Midterm" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Course Code</Label>
                <Input 
                  id="subject" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" 
                  placeholder="e.g. CS201" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger className="bg-background border-border h-9 text-sm rounded-md focus:ring-1 focus:ring-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Duration (Mins)</Label>
                <Input 
                  id="duration" 
                  type="number" 
                  required
                  min={1}
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                  className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date" 
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" 
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="bg-muted/50 hover:bg-muted text-foreground rounded-full px-5 h-9 text-sm">
              Cancel
            </Button>
            <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 h-9 text-sm">
              {isEditing ? "Save Changes" : "Create Exam"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}