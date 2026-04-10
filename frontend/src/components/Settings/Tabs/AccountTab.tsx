import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { SaveFooter } from "../Shared";
import { updateProfileApi } from "../../../api/settings";

export function AccountTab({ user, role }: { user: any; role: string }) {
  const isInstructor = role === "instructor";

  // Split name for the UI, though you might just use a single 'name' field
  const nameParts = (user?.name || "").split(" ");

  // Local state for the form
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" ") || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfileApi({
        name: `${firstName} ${lastName}`.trim(),
        bio,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-card border-border shadow-sm text-left">
      <CardHeader>
        <CardTitle className="text-foreground">Account Details</CardTitle>
        <CardDescription className="text-muted-foreground">
          {isInstructor
            ? "Manage your contact details and department information."
            : "Manage your contact details and personal preferences."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20 border border-border">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="text-2xl bg-muted text-muted-foreground">
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            className="border-border hover:bg-muted text-foreground"
          >
            <UploadCloud className="w-4 h-4 mr-2" /> Change Avatar
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-foreground">First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground">Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>

          <div className="flex w-full justify-between">
            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground">Email Address</Label>
              <Input
                value={user?.email || ""}
                readOnly
                className="bg-muted text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground">Student ID</Label>
              <Input
                value={user?.studentId || ""}
                readOnly
                className="bg-muted text-muted-foreground focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2 max-w-[50%]">
            <Label className="text-foreground">
              {isInstructor ? "Department / Bio" : "About Me"}
            </Label>
            <Textarea
              value={bio}
              readOnly
              onChange={(e) => setBio(e.target.value)}
              className="bg-muted text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>
      </CardContent>
      <SaveFooter onSave={handleSave} isSaving={isSaving} />
    </Card>
  );
}
