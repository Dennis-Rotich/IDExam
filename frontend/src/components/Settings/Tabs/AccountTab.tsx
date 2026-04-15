import { useState } from "react";
import { Save, Loader2, Mail, User as UserIcon, Link as LinkIcon, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { updateUserApi } from "../../../api/auth";

interface AccountTabProps {
  user: any;
  role: string;
  onUpdateSuccess?: () => void;
}

export function AccountTab({ user, role, onUpdateSuccess }: AccountTabProps) {
  // Only track the mutable fields in state
  const [formData, setFormData] = useState({
    avatarUrl: user?.avatarUrl || "",
    cohort: user?.cohort || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserApi({
        avatarUrl: formData.avatarUrl,
        cohort: formData.cohort,
      });

      toast.success("Profile updated successfully.");
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error: any) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if anything actually changed to enable/disable the save button
  const hasChanges = 
    formData.avatarUrl !== (user?.avatarUrl || "") || 
    formData.cohort !== (user?.cohort || "");

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      
      <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
        <div className="py-3 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Identity Information
        </div>
        
        <div className="p-6 space-y-6">
          {/* READ-ONLY: Name */}
          <div className="space-y-2 opacity-70">
            <label className="text-xs font-medium text-foreground flex items-center gap-2">
              <UserIcon className="w-3.5 h-3.5" /> Full Name
            </label>
            <Input 
              className="bg-muted cursor-not-allowed border-border" 
              value={user?.name || "N/A"}
              readOnly
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Contact administration to change your registered name.
            </p>
          </div>

          {/* READ-ONLY: Email */}
          <div className="space-y-2 opacity-70">
            <label className="text-xs font-medium text-foreground flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <Input 
              className="bg-muted cursor-not-allowed border-border" 
              value={user?.email || "N/A"}
              readOnly
            />
          </div>

          <div className="border-t border-border pt-6 mt-2"></div>

          {/* MUTABLE: Avatar URL */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5" /> Avatar Image URL
            </label>
            <div className="flex gap-4 items-center">
              {formData.avatarUrl ? (
                <img 
                  src={formData.avatarUrl} 
                  alt="Avatar Preview" 
                  className="w-10 h-10 rounded-full object-cover border border-border shrink-0 bg-muted"
                  onError={(e) => (e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'User'}`)}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted border border-border shrink-0 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <Input 
                className="bg-background border-border flex-1" 
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://example.com/my-photo.jpg"
              />
            </div>
          </div>

          {/* MUTABLE: Cohort (Only show if student) */}
          {role === "student" && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Assigned Cohort
              </label>
              <Input 
                className="bg-background border-border" 
                value={formData.cohort}
                onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                placeholder="e.g. CS-2026-A"
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Your cohort identifier dictates which exams and assignments are available to you.
              </p>
            </div>
          )}

          {/* Read-Only Role Indicator */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-medium text-foreground">Account Type</label>
            <div>
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground capitalize border border-border">
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !hasChanges}
            className="h-9 rounded-full px-6 text-xs font-medium"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}