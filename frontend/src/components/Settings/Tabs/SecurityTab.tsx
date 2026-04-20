import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2, KeyRound } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { updatePasswordApi } from "../../../api/settings";

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    if (newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    
    try {
      setIsSaving(true);
      await updatePasswordApi({ currentPassword, newPassword });
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = currentPassword.length > 0 && newPassword.length > 0;

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      <div className="flex flex-col border border-border rounded-lg overflow-hidden bg-card/30">
        <div className="py-3 px-4 border-b border-border bg-muted/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <KeyRound className="w-3.5 h-3.5" /> Security & Access
        </div>
        
        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Current Password</label>
            <Input 
              type="password" 
              className="bg-background border-border"
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
          </div>
          
          <div className="border-t border-border pt-5 mt-2"></div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">New Password</label>
            <Input 
              type="password" 
              className="bg-background border-border"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Confirm New Password</label>
            <Input 
              type="password" 
              className="bg-background border-border"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 flex justify-end">
          <Button 
            onClick={handleUpdatePassword} 
            disabled={isSaving || !hasChanges} 
            className="h-9 rounded-full px-6 text-xs font-medium"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            {isSaving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}