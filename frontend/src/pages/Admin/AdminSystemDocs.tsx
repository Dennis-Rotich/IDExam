import { 
  BookOpen, Terminal, Key, Blocks, FileText, 
  Activity, LifeBuoy, ExternalLink, ArrowRight 
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

// --- MOCK DATA ---
const DOC_LINKS = [
  { id: "api", title: "REST API Reference", desc: "Endpoints, rate limits, and webhooks.", icon: Terminal, color: "text-blue-500 dark:text-blue-400" },
  { id: "sso", title: "SSO & SAML Configuration", desc: "Setting up Okta, Entra ID, or Google Auth.", icon: Key, color: "text-purple-500 dark:text-purple-400" },
  { id: "lti", title: "LMS Integrations (LTI 1.3)", desc: "Connecting Canvas, Blackboard, or Moodle.", icon: Blocks, color: "text-amber-500 dark:text-amber-400" },
  { id: "admin", title: "Admin Operations Guide", desc: "User roles, bulk imports, and proctoring configs.", icon: BookOpen, color: "text-emerald-500 dark:text-emerald-400" },
];

const CHANGELOG = [
  { version: "v2.4.1", date: "Mar 25, 2026", type: "Update", title: "Enhanced Proctoring Strictness", desc: "Added hardware-level virtual machine detection to the live proctoring engine." },
  { version: "v2.4.0", date: "Mar 18, 2026", type: "Feature", title: "Bulk CSV Export for Audit Logs", desc: "Admins can now export up to 90 days of immutable audit logs directly from the dashboard." },
  { version: "v2.3.9", date: "Mar 10, 2026", type: "Fix", title: "SSO Token Expiration Bug", desc: "Resolved an issue where SAML assertions were terminating sessions 5 minutes early." },
  { version: "v2.3.8", date: "Mar 02, 2026", type: "Update", title: "New Monaco Editor Version", desc: "Upgraded the internal code editor to support Rust and Go syntax highlighting." },
];

export function AdminSystemDocsPage() {
  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FileText className="w-8 h-8 text-muted-foreground" /> System & Documentation
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Platform architecture guides, API references, release notes, and vendor support.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-full bg-card/30">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-foreground">All Systems Operational</span>
          </div>
          <Button variant="outline" className="h-10 rounded-full px-5 text-sm border-border text-foreground hover:bg-muted">
            Status Page <ExternalLink className="w-3.5 h-3.5 ml-2" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Docs & Changelog */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Documentation Links */}
          <div className="border border-border rounded-lg bg-card/30 flex flex-col overflow-hidden">
            <div className="py-3 px-5 border-b border-border bg-muted/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Platform Documentation</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {DOC_LINKS.map((doc, i) => (
                <div key={doc.id} className={`p-5 hover:bg-muted/20 transition-colors cursor-pointer group ${i > 1 ? 'border-t border-border' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded border border-border bg-muted/30 ${doc.color} shrink-0`}>
                      <doc.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors flex items-center gap-1">
                        {doc.title} <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{doc.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Release Notes / Changelog */}
          <div className="border border-border rounded-lg bg-card/30 flex flex-col overflow-hidden">
            <div className="py-3 px-5 border-b border-border bg-muted/10 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Release Notes & Changelog</h2>
              <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">View All Updates</span>
            </div>
            <div className="divide-y divide-border/50">
              {CHANGELOG.map((log, idx) => (
                <div key={idx} className="p-5 hover:bg-muted/10 transition-colors flex gap-5">
                  <div className="w-24 shrink-0 flex flex-col items-end text-right pt-0.5">
                    <span className="text-sm font-mono font-bold text-foreground">{log.version}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{log.date}</span>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground ring-4 ring-background z-10" />
                    {idx !== CHANGELOG.length - 1 && <div className="w-px h-full bg-border absolute top-2.5" />}
                  </div>

                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        log.type === 'Feature' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 
                        log.type === 'Fix' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' : 
                        'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                      }`}>
                        {log.type}
                      </span>
                      <h3 className="text-sm font-bold text-foreground">{log.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Escalation Portal */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="border border-border rounded-lg bg-card/30 flex flex-col overflow-hidden h-fit">
            <div className="py-3 px-5 border-b border-border bg-muted/10">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                <LifeBuoy className="w-4 h-4" /> Vendor Escalation Portal
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-blue-500/5 border border-blue-500/20 rounded-md p-4 text-sm text-foreground leading-relaxed">
                <strong className="text-blue-600 dark:text-blue-400">Admin Priority Support:</strong> Use this portal strictly for platform-level outages, billing inquiries, or SSO/API integration failures. End-user academic queries should be handled internally.
              </div>

              <form className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Issue Type</label>
                  <select className="w-full h-9 px-3 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-border text-foreground">
                    <option>API / Webhook Failure</option>
                    <option>SSO / Identity Provider Issue</option>
                    <option>Platform Outage / Latency</option>
                    <option>Security / Compliance Query</option>
                    <option>Other Infrastructure Issue</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
                  <Input required placeholder="Brief description of the issue" className="bg-background border-border h-9 text-sm focus-visible:ring-1 focus-visible:ring-border rounded-md" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detailed Diagnostic Context</label>
                  <Textarea required placeholder="Include relevant error codes, timestamps (UTC), and user IDs affected..." className="bg-background border-border min-h-[160px] resize-none text-sm p-3 focus-visible:ring-1 focus-visible:ring-border rounded-md" />
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="button" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6 h-9 text-xs font-medium">
                    Submit Priority Ticket
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}