import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Users, FileText, AlertCircle, Clock, BarChart2, ChevronRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "../../components/ui/button";
import { getInstructorDashboardApi } from "../../api/auth";
import { toast } from "sonner";

export function InstructorOverview() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  const [dashboardData, setDashboardData] = useState({
    kpis: { candidates: 0, activeExams: 0, pendingGrades: 0, integrity: "Secure" },
    performanceData: [] as any[],
    pendingGrading: [] as any[]
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await getInstructorDashboardApi();
        setDashboardData({
          kpis: data.kpis || { candidates: 0, activeExams: 0, pendingGrades: 0, integrity: "Secure" },
          performanceData: data.performanceData || [],
          pendingGrading: data.pendingGrading || []
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { kpis, performanceData, pendingGrading } = dashboardData;

  return (
    <div className="mx-auto space-y-10 pb-12 text-foreground text-left px-2">
      
      {/* 1. HEADER & FLATTENED KPIs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Instructor Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Monitor class performance and manage grading tasks.</p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> Candidates</p><p className="text-2xl font-mono font-medium text-foreground">{kpis.candidates}</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Active Exams</p><p className="text-2xl font-mono font-medium text-foreground">{kpis.activeExams}</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Pending Grade</p><p className="text-2xl font-mono font-medium text-amber-500">{kpis.pendingGrades}</p></div>
          <div><p className="text-muted-foreground mb-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5"/> Integrity</p><p className="text-2xl font-sans font-medium text-emerald-500">{kpis.integrity}</p></div>
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
            {performanceData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm border border-dashed border-border rounded-lg">
                No performance data available yet.
              </div>
            )}
          </div>
        </div>

        {/* ACTION QUEUE (Flat List) */}
        <div className="lg:col-span-3 flex flex-col border border-border rounded-lg overflow-hidden bg-card/30 h-[400px]">
          <div className="py-3 px-5 border-b border-border bg-muted/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Action Queue</h2>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full">{kpis.pendingGrades} Pending</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 divide-y divide-border">
            {pendingGrading.length > 0 ? (
              pendingGrading.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-md transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-muted rounded mt-0.5"><Clock className="w-3.5 h-3.5 text-muted-foreground" /></div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.student}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.exam} • {item.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground group-hover:text-foreground group-hover:bg-background border border-transparent group-hover:border-border rounded-full px-4" onClick={() => navigate(`exam/submission/review/${item.id}`)}>
                    Review <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                You're all caught up!
              </div>
            )}
          </div>
          {pendingGrading.length > 0 && (
            <div className="p-2 border-t border-border bg-muted/10">
              <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground hover:text-foreground">View All</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}