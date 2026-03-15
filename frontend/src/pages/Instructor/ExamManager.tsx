import { useState } from "react";
import { Plus, Search, MoreHorizontal, FileEdit, Trash, History, ShieldAlert, Terminal, Filter } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

// --- DUMMY DATA ---
const EXAMS = [
  { id: "EX-101", title: "Data Structures Midterm", status: "Active", candidates: 45, date: "2026-03-15" },
  { id: "EX-102", title: "Algorithms Final", status: "Draft", candidates: 0, date: "TBD" },
  { id: "EX-103", title: "React Frontend Evaluation", status: "Completed", candidates: 120, date: "2026-02-28" },
  { id: "EX-104", title: "Database Architecture", status: "Completed", candidates: 85, date: "2026-01-15" },
];

const HISTORICAL_LOGS = [
  { time: "14:05:22", student: "Alice K.", type: "system", message: "Exam submitted successfully." },
  { time: "13:42:10", student: "Marcus J.", type: "integrity", message: "Window focus lost for 45s." },
  { time: "13:15:00", student: "David L.", type: "integrity", message: "Clipboard paste event detected (120 chars)." },
  { time: "12:50:05", student: "Sarah M.", type: "system", message: "Connection restored." },
  { time: "12:48:12", student: "Sarah M.", type: "system", message: "Network disconnection detected." },
];

export function ExamManager() {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const openReport = (exam: any) => {
    setSelectedExam(exam);
    setReportOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active": return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Active</Badge>;
      case "Draft": return <Badge variant="outline" className="text-slate-500 border-slate-300">Draft</Badge>;
      case "Completed": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none">Completed</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  // Derived state for filtering
  const filteredExams = EXAMS.filter((exam) => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exam.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || exam.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 text-slate-900">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        
        {/* Filter Controls Group */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search exam ID or title..." 
              className="pl-8 bg-white border-slate-200" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white border-slate-200">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="text-black sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
              <DialogDescription>
                Set up a new examination instance. You can add questions later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Exam Title</label>
                <Input id="title" placeholder="e.g. System Design Final" />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">Duration (Minutes)</label>
                <Input id="duration" type="number" placeholder="120" />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create Instance</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <div className="rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="text-slate-600 font-medium">Exam ID</TableHead>
              <TableHead className="text-slate-600 font-medium">Title</TableHead>
              <TableHead className="text-slate-600 font-medium">Status</TableHead>
              <TableHead className="text-right text-slate-600 font-medium">Candidates</TableHead>
              <TableHead className="text-right text-slate-600 font-medium">Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <TableRow key={exam.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-700">{exam.id}</TableCell>
                  <TableCell className="text-slate-900">{exam.title}</TableCell>
                  <TableCell>{getStatusBadge(exam.status)}</TableCell>
                  <TableCell className="text-right text-slate-600">{exam.candidates}</TableCell>
                  <TableCell className="text-right text-slate-600">{exam.date}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-200">
                          <MoreHorizontal className="h-4 w-4 text-slate-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-slate-500 text-xs uppercase tracking-wider">Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer">
                          <FileEdit className="mr-2 h-4 w-4 text-slate-500" /> Edit Details
                        </DropdownMenuItem>
                        
                        {exam.status !== "Draft" && (
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openReport(exam)}>
                            <History className="mr-2 h-4 w-4 text-blue-500" /> View Audit Logs
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer">
                          <Trash className="mr-2 h-4 w-4" /> Delete Exam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No exams found matching your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Hidden Dialog for the Audit Report */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="text-black sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Proctoring Audit Report</DialogTitle>
            <DialogDescription>
              {selectedExam?.id} — {selectedExam?.title} ({selectedExam?.date})
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-100 mb-2">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Candidates</p>
              <p className="text-2xl font-bold text-slate-900">{selectedExam?.candidates}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Flagged Events</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-slate-900 mb-2">Session Telemetry Log</h4>
          <ScrollArea className="h-[300px] w-full rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-4">
              {HISTORICAL_LOGS.map((log, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <div className="mt-0.5">
                    {log.type === 'integrity' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                    {log.type === 'system' && <Terminal className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{log.student}</span>
                      <span className="text-xs font-mono text-slate-500">{log.time}</span>
                    </div>
                    <p className="text-sm mt-0.5 text-slate-600">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}