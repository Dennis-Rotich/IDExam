import { useNavigate } from "react-router-dom";
import { Activity, Users, FileText, AlertCircle, Clock, BarChart2, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../../components/ui/button";

const performanceData = [
  { name: "CS101", avgScore: 78, highest: 100 },
  { name: "SYS-ARC", avgScore: 65, highest: 95 },
  { name: "PY-ADV", avgScore: 82, highest: 98 },
  { name: "DB-INT", avgScore: 71, highest: 90 },
  { name: "SEC-01", avgScore: 59, highest: 88 },
];

const pendingGrading = [
  { id: "SUB-892", exam: "SYS-ARC", student: "Alice K.", time: "10 mins ago" },
  { id: "SUB-893", exam: "SEC-01", student: "John D.", time: "1 hour ago" },
  { id: "SUB-894", exam: "PY-ADV", student: "Sarah M.", time: "2 hours ago" },
  { id: "SUB-895", exam: "CS101", student: "Mark R.", time: "3 hours ago" },
];

export function InstructorOverview() {
  const navigate = useNavigate();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card text-foreground border border-border p-3 rounded-md shadow-md">
          <p className="font-semibold text-xs mb-2 uppercase tracking-wider text-muted-foreground">{label}</p>
          <div className="flex flex-col gap-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
                <span className="font-mono font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mx-auto space-y-10 pb-12 text-foreground text-left px-2">
      
      {/* 1. HEADER & FLATTENED KPIs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor class performance and manage grading tasks.</p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Candidates</p><p className="text-2xl font-mono font-medium text-foreground">124</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Active Exams</p><p className="text-2xl font-mono font-medium text-foreground">3</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Pending Grade</p><p className="text-2xl font-mono font-medium text-amber-500">48</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Integrity</p><p className="text-2xl font-sans font-medium text-emerald-500">Secure</p></div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-7">
        
        {/* CHART SECTION */}
        <div className="lg:col-span-4 border border-border rounded-lg p-5 bg-card/50 flex flex-col h-[400px]">
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2"><BarChart2 className="w-4 h-4"/> Average Performance</h2>
            <p className="text-xs text-muted-foreground mt-1">Mean score distribution across recent active exams.</p>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.2 }} content={<CustomTooltip />} />
                <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Avg Score" barSize={32} />
                <Bar dataKey="highest" fill="#10b981" radius={[4, 4, 0, 0]} name="Highest" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACTION QUEUE (Flat List) */}
        <div className="lg:col-span-3 flex flex-col border border-border rounded-lg overflow-hidden bg-card/30 h-[400px]">
          <div className="py-3 px-5 border-b border-border bg-muted/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Action Queue</h2>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">48 Pending</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 divide-y divide-border">
            {pendingGrading.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-md transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-muted rounded mt-0.5"><Clock className="w-3.5 h-3.5 text-muted-foreground" /></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.student}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.exam} • {item.time}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground group-hover:text-foreground group-hover:bg-background border border-transparent group-hover:border-border rounded-full px-4" onClick={() => navigate("exam/submission/review/2")}>
                  Review <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border bg-muted/10">
            <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">View All</Button>
          </div>
        </div>

      </div>
    </div>
  );
}