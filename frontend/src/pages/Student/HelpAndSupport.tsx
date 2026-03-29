import { useState } from "react";
import { 
  Activity, CheckCircle2, AlertCircle, Server, Video,
  ShieldCheck, Loader2, Play
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
// --- MOCK DATA ---
const SYSTEM_STATUS = [
  { id: "s1", name: "Core Exam Engine", status: "Operational", icon: Server, color: "text-emerald-500" },
  { id: "s2", name: "Live Proctoring (Video/Audio)", status: "Operational", icon: Video, color: "text-emerald-500" },
  { id: "s3", name: "Automated Grading Service", status: "Degraded Performance", icon: Activity, color: "text-amber-500" },
  { id: "s4", name: "Submission Storage", status: "Operational", icon: ShieldCheck, color: "text-emerald-500" },
];

export function HelpAndSupportPage() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  const runDiagnostics = () => {
    setIsChecking(true); setCheckComplete(false);
    setTimeout(() => { setIsChecking(false); setCheckComplete(true); }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 text-foreground text-left px-2 pt-4">
      
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-muted-foreground mt-1 text-sm">System status, diagnostics, and technical assistance.</p>
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYSTEM_STATUS.map((service) => (
            <div key={service.id} className="p-4 rounded-md border border-border bg-muted/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <service.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {service.status === "Operational" ? <CheckCircle2 className={`w-3 h-3 ${service.color}`} /> : <AlertCircle className={`w-3 h-3 ${service.color}`} />}
                <span className={service.color}>{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Local Diagnostics</h2>
          {!isChecking && !checkComplete && (
            <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-500 hover:text-blue-400 p-0" onClick={runDiagnostics}>
              <Play className="w-3 h-3 mr-1" /> Run Check
            </Button>
          )}
        </div>
        
        <div className="p-6 border border-border rounded-lg bg-card text-center">
          {!isChecking && !checkComplete && <p className="text-sm text-muted-foreground">Ensure your environment is ready before an exam starts.</p>}
          {isChecking && <div className="flex justify-center"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>}
          {checkComplete && (
            <div className="grid grid-cols-3 gap-4 text-left animate-in fade-in">
              <div className="p-3 bg-muted/10 rounded border border-border/50 text-center"><p className="text-xs text-muted-foreground mb-1">Network</p><p className="text-sm font-medium text-emerald-500">24ms</p></div>
              <div className="p-3 bg-muted/10 rounded border border-border/50 text-center"><p className="text-xs text-muted-foreground mb-1">Video Feed</p><p className="text-sm font-medium text-emerald-500">Passed</p></div>
              <div className="p-3 bg-muted/10 rounded border border-border/50 text-center"><p className="text-xs text-muted-foreground mb-1">Browser Lock</p><p className="text-sm font-medium text-emerald-500">Supported</p></div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Submit a Ticket</h2>
        <form className="space-y-4 max-w-2xl">
          <Input required placeholder="Issue Subject" className="bg-background border-border rounded-md" />
          <Textarea required placeholder="Describe what happened..." className="bg-background border-border min-h-[100px] rounded-md resize-none" />
          <Button type="button" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6">Submit</Button>
        </form>
      </div>

    </div>
  );
}