import { useState } from "react";
import { 
  Activity, CheckCircle2, AlertCircle, Server, Video,
  ShieldCheck, Loader2, Play, BookOpen, Users, FileText
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

const SYSTEM_STATUS = [
  { id: "s1", name: "Core Exam Engine", status: "Operational", icon: Server, color: "text-emerald-500" },
  { id: "s2", name: "Live Proctoring (Video/Audio)", status: "Operational", icon: Video, color: "text-emerald-500" },
  { id: "s3", name: "Automated Grading Service", status: "Degraded Performance", icon: Activity, color: "text-amber-500" },
  { id: "s4", name: "Submission Storage", status: "Operational", icon: ShieldCheck, color: "text-emerald-500" },
];

// New: FAQ Content by Role
const FAQ_CONTENT = {
  student: [
    { title: "Lost Connection?", desc: "IDExam auto-saves your progress every 30 seconds." },
    { title: "Tab Switching", desc: "Our proctoring agent logs every time you leave the exam tab." }
  ],
  instructor: [
    { title: "AI Generation", desc: "Upload a PDF to let the agent draft your questions." },
    { title: "Flagging Logic", desc: "Review the 'Suspicion Score' in your dashboard for anomalies." }
  ]
};

interface HelpAndSupportProps {
  role: 'instructor' | 'student';
}

export function HelpAndSupportPage({ role = 'student' }: HelpAndSupportProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  const runDiagnostics = () => {
    setIsChecking(true); setCheckComplete(false);
    setTimeout(() => { setIsChecking(false); setCheckComplete(true); }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 text-foreground text-left px-4 pt-8">
      
      {/* 1. Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {role === 'instructor' ? 'Instructor Support' : 'Student Help Center'}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
            {role === 'instructor' ? 'Manage your exams and review proctoring integrity.' : 'System status and technical diagnostics.'}
        </p>
      </div>

      {/* 2. System Status (Universal) */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Global System Status</h2>
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

      {/* 3. Role-Specific Content Area */}
      {role === 'student' ? (
        /* STUDENT VIEW: Diagnostics */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Local Environment Diagnostics</h2>
            {!isChecking && !checkComplete && (
              <Button size="sm" variant="ghost" className="h-6 text-xs text-blue-500 hover:text-blue-400 p-0" onClick={runDiagnostics}>
                <Play className="w-3 h-3 mr-1" /> Run Check
              </Button>
            )}
          </div>
          <div className="p-6 border border-border rounded-lg bg-card text-center">
            {/* ... your existing diagnostic logic ... */}
            {!isChecking && !checkComplete && <p className="text-sm text-muted-foreground">Verify your hardware and network before the exam begins.</p>}
            {isChecking && <div className="flex justify-center"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>}
            {checkComplete && (
              <div className="grid grid-cols-3 gap-4 text-left animate-in fade-in">
                <div className="p-3 bg-muted/10 rounded border border-border/50 text-center"><p className="text-xs text-muted-foreground mb-1">Network</p><p className="text-sm font-medium text-emerald-500">24ms</p></div>
                <div className="p-3 bg-muted/10 rounded border border-border/50 text-center"><p className="text-xs text-muted-foreground mb-1">Hardware</p><p className="text-sm font-medium text-emerald-500">Passed</p></div>
                <div className="p-3 bg-muted/10 rounded border border-border/50 text-center"><p className="text-xs text-muted-foreground mb-1">Browser</p><p className="text-sm font-medium text-emerald-500">Secure</p></div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INSTRUCTOR VIEW: Quick Links */
        <div className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Instructor Quick-Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/10 cursor-pointer">
              <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
              <h3 className="text-sm font-medium">Exam Templates</h3>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/10 cursor-pointer">
              <Users className="w-5 h-5 text-purple-500 mb-2" />
              <h3 className="text-sm font-medium">Student Registry</h3>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted/10 cursor-pointer">
              <FileText className="w-5 h-5 text-amber-500 mb-2" />
              <h3 className="text-sm font-medium">Incident Reports</h3>
            </div>
          </div>
        </div>
      )}

      {/* 4. Common FAQ/Knowledge Base */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Common Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FAQ_CONTENT[role].map((faq, idx) => (
            <div key={idx}>
              <h3 className="text-sm font-medium text-foreground">{faq.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{faq.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Support Ticket (Modified to be role-aware) */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Submit {role === 'instructor' ? 'Faculty Support' : 'Technical'} Ticket</h2>
        <form className="space-y-4 max-w-2xl">
          <Input required placeholder={role === 'instructor' ? "Module Name / Course ID" : "Issue Subject"} className="bg-background border-border" />
          <Textarea required placeholder="Please provide specific details for the support agent..." className="bg-background border-border min-h-[100px] resize-none" />
          <Button type="button" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-8">Send Request</Button>
        </form>
      </div>

    </div>
  );
}