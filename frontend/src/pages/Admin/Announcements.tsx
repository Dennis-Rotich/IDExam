import { Megaphone, Send, Clock, Trash2, CheckCircle2, CircleDashed } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

// --- MOCK DATA ---
const HISTORY = [
  { id: "a1", title: "Scheduled Maintenance Window", audience: "All Users", status: "Published", date: "Mar 28, 2026" },
  { id: "a2", title: "New Academic Integrity Policies", audience: "Students", status: "Published", date: "Mar 20, 2026" },
  { id: "a3", title: "Midterm Proctoring Best Practices", audience: "Instructors", status: "Draft", date: "TBD" },
];

export function AdminAnnouncementsPage() {

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Megaphone className="w-7 h-7 text-muted-foreground" /> Platform Announcements
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Broadcast notices, alerts, and updates to specific user groups.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: Compose Form */}
        <div className="border border-border rounded-lg bg-card/30 flex flex-col h-fit">
          <div className="py-3 px-5 border-b border-border bg-muted/10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Compose Message</h2>
          </div>
          
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
              <Input placeholder="e.g. System Maintenance This Weekend" className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-full bg-background border-border h-9 text-sm rounded-md focus:ring-1 focus:ring-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="instructors">Instructors Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message Body</label>
              <Textarea placeholder="Type your announcement here..." className="bg-background border-border min-h-[150px] resize-none text-sm p-3 focus-visible:ring-1 focus-visible:ring-border rounded-md" />
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t border-border pt-5">
              <Button variant="secondary" className="bg-muted/50 hover:bg-muted text-foreground rounded-full px-5 h-9 text-xs font-medium">
                Save Draft
              </Button>
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-5 h-9 text-xs font-medium">
                <Send className="w-3.5 h-3.5 mr-2" /> Publish Notice
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT: History List */}
        <div className="border border-border rounded-lg bg-card/30 flex flex-col h-fit">
          <div className="py-3 px-5 border-b border-border bg-muted/10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Announcement History</h2>
          </div>
          
          <div className="divide-y divide-border/50">
            {HISTORY.map((item) => (
              <div key={item.id} className="p-4 hover:bg-muted/20 transition-colors flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="mt-1">
                    {item.status === "Published" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <CircleDashed className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{item.audience}</span>
                      <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3" /> {item.date}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}