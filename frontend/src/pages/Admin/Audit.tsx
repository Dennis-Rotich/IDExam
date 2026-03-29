import { useState } from "react";
import { Terminal, Search, ListFilter, Download, Clock, Shield, UserCog, Database, Lock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// --- MOCK DATA ---
type AuditAction = "SECURITY" | "USER_MGMT" | "CONTENT" | "SYSTEM";

interface AuditEntry {
  id: string; timestamp: string; actionType: AuditAction; actor: string; target: string; details: string; ip: string;
}

const AUDIT_LOGS: AuditEntry[] = [
  { id: "al-01", timestamp: "2026-03-28 09:12:45 UTC", actionType: "USER_MGMT", actor: "admin@tahini.edu", target: "dr.okonkwo@tahini.edu", details: "Role updated: STUDENT -> INSTRUCTOR", ip: "192.168.1.45" },
  { id: "al-02", timestamp: "2026-03-28 08:45:11 UTC", actionType: "CONTENT", actor: "dr.velez@tahini.edu", target: "Exam ID: 8992", details: "Exam published: CS301 Midterm", ip: "10.0.0.12" },
  { id: "al-03", timestamp: "2026-03-28 07:30:00 UTC", actionType: "SECURITY", actor: "SYSTEM", target: "Platform SSO", details: "SAML Certificate rotated successfully", ip: "localhost" },
  { id: "al-04", timestamp: "2026-03-27 18:22:19 UTC", actionType: "USER_MGMT", actor: "admin@tahini.edu", target: "stu_9921@tahini.edu", details: "Account suspended: Integrity violation", ip: "192.168.1.45" },
  { id: "al-05", timestamp: "2026-03-27 14:10:05 UTC", actionType: "SYSTEM", actor: "registrar@tahini.edu", target: "User DB", details: "Bulk import: 450 student records created", ip: "172.16.2.8" },
  { id: "al-06", timestamp: "2026-03-27 11:05:33 UTC", actionType: "CONTENT", actor: "dr.chen@tahini.edu", target: "Exam ID: 7711", details: "Manual override: Extended deadline by 30m", ip: "10.0.0.19" },
];

function getActionIcon(type: AuditAction) {
  switch(type) {
    case "SECURITY": return <Lock className="w-3.5 h-3.5 text-red-500" />;
    case "USER_MGMT": return <UserCog className="w-3.5 h-3.5 text-blue-500" />;
    case "CONTENT": return <Database className="w-3.5 h-3.5 text-emerald-500" />;
    case "SYSTEM": return <Shield className="w-3.5 h-3.5 text-amber-500" />;
  }
}

export function AdminAuditLogPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | AuditAction>("ALL");

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Terminal className="w-7 h-7 text-muted-foreground" /> System Audit Log
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Immutable ledger of platform actions for compliance review.</p>
        </div>
        <Button variant="secondary" className="bg-muted/50 hover:bg-muted text-foreground h-9 rounded-full px-5 text-sm shrink-0">
          <Download className="w-4 h-4 mr-2" /> Export Logs (CSV)
        </Button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2 border-b border-border pb-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
          {["ALL", "SECURITY", "USER_MGMT", "CONTENT", "SYSTEM"].map((type) => {
            const isActive = filter === type;
            return (
              <Button 
                key={type} onClick={() => setFilter(type as any)} variant={isActive ? "default" : "secondary"}
                className={`rounded-full h-9 px-4 shrink-0 text-xs font-mono transition-colors ${
                  isActive ? "bg-foreground text-background" : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
                }`}
              >
                {type}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search actor, target, or details..." className="pl-9 bg-muted/30 border-transparent focus-visible:ring-1 focus-visible:ring-border h-9 text-sm rounded-full font-mono text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ListFilter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* TERMINAL-STYLE LOG LIST */}
      <div className="w-full text-sm border border-border bg-[#0a0a0a] dark:bg-background rounded-lg overflow-hidden font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between py-2.5 px-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/10 border-b border-border/50">
          <div className="w-44 shrink-0">Timestamp (UTC)</div>
          <div className="flex-1 min-w-0 flex gap-4">
            <div className="w-32">Type</div>
            <div className="w-48">Actor</div>
            <div className="flex-1">Action Details</div>
          </div>
          <div className="w-32 text-right">IP Address</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-border/30">
          {AUDIT_LOGS.map((log) => (
            <div key={log.id} className="flex items-start justify-between py-2.5 px-4 hover:bg-muted/10 transition-colors text-xs text-[#d4d4d4] dark:text-foreground/80">
              
              <div className="w-44 shrink-0 flex items-center gap-1.5 opacity-70">
                <Clock className="w-3 h-3" /> {log.timestamp}
              </div>
              
              <div className="flex-1 min-w-0 flex gap-4">
                <div className="w-32 flex items-center gap-2">
                  {getActionIcon(log.actionType)}
                  <span className="opacity-90">{log.actionType}</span>
                </div>
                <div className="w-48 truncate text-blue-400 dark:text-blue-500">
                  {log.actor}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="opacity-60">[{log.target}]</span> <span className="text-emerald-400 dark:text-emerald-500">{log.details}</span>
                </div>
              </div>

              <div className="w-32 text-right opacity-50">
                {log.ip}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}