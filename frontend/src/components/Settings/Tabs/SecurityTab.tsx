import { useState } from "react";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../ui/card";
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

  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Security & Access</CardTitle>
        <CardDescription className="text-muted-foreground">Manage your password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2 max-w-xl">
            <Label className="text-foreground">Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-2 max-w-xl">
            <Label className="text-foreground">New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2 max-w-xl">
            <Label className="text-foreground">Confirm New Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-border px-6 py-4 justify-end">
        <Button onClick={handleUpdatePassword} disabled={isSaving || !newPassword} className="bg-foreground text-background">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}