import { 
  Calendar, 
  Clock,
  ShieldCheck, 
  AlertCircle,
  MonitorPlay,
  FileText,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

// --- DUMMY DATA ---
const UPCOMING_EXAMS = [
  { 
    id: "EX-101", 
    course: "COMP 314: Advanced Algorithms", 
    title: "Midterm Evaluation", 
    date: "Today, 2:00 PM", 
    duration: "90 mins",
    status: "ready", // ready, upcoming
    requiresKiosk: true
  },
  { 
    id: "EX-102", 
    course: "COMP 402: Distributed Systems", 
    title: "Module 1 Quiz", 
    date: "Tomorrow, 10:00 AM", 
    duration: "45 mins",
    status: "upcoming",
    requiresKiosk: true
  }
];

const PAST_RESULTS = [
  { id: "EX-098", course: "COMP 201: Data Structures", title: "Final Exam", date: "Feb 28, 2026", score: 88, status: "graded" },
  { id: "EX-099", course: "COMP 205: React Frontend", title: "Component Evaluation", date: "Mar 10, 2026", score: null, status: "pending" },
];

export function StudentDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 pt-6 text-slate-900 px-4">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, Isaiah</h1>
        <p className="text-slate-500 mt-1">Kabarak University • Department of Computer Science</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Exams */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Exams</TabsTrigger>
              <TabsTrigger value="past">Past Results</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4 space-y-4">
              {UPCOMING_EXAMS.map((exam) => (
                <Card key={exam.id} className={`border-slate-200 shadow-sm transition-all ${exam.status === 'ready' ? 'border-blue-200 bg-blue-50/30' : 'bg-white'}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100">{exam.course}</Badge>
                          {exam.requiresKiosk && (
                            <Badge variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Secure Kiosk
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900">{exam.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {exam.date}</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {exam.duration}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {exam.status === 'ready' ? (
                          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                            <MonitorPlay className="w-4 h-4 mr-2" /> Launch Exam
                          </Button>
                        ) : (
                          <Button disabled variant="outline" className="w-full md:w-auto bg-slate-50 text-slate-400 border-slate-200">
                            Opens in 18 hrs
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              <Card className="bg-white border-slate-200 shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow>
                      <TableHead className="text-slate-600">Course</TableHead>
                      <TableHead className="text-slate-600">Exam</TableHead>
                      <TableHead className="text-slate-600">Date</TableHead>
                      <TableHead className="text-right text-slate-600">Score</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PAST_RESULTS.map((result) => (
                      <TableRow key={result.id} className="border-slate-100">
                        <TableCell className="font-medium text-slate-700">{result.course}</TableCell>
                        <TableCell className="text-slate-900">{result.title}</TableCell>
                        <TableCell className="text-slate-500">{result.date}</TableCell>
                        <TableCell className="text-right">
                          {result.status === 'graded' ? (
                            <span className="font-bold text-slate-900">{result.score}%</span>
                          ) : (
                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending Grading</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: System Status */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-emerald-500" />
                System Pre-Flight
              </CardTitle>
              <CardDescription>
                Verification required before launching secure kiosk exams.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Network Connection</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">24ms ping</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-700">Electron Container</span>
                </div>
                <span className="text-xs text-emerald-600 font-medium">Verified</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-slate-700">Background Processes</span>
                </div>
                <span className="text-xs text-amber-600 font-medium flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> 1 Warning
                </span>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mt-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please close <strong className="font-semibold">Discord.exe</strong> before launching your exam. The kiosk container will block access if unauthorized communication apps are running.
                </p>
              </div>

              <Button variant="outline" className="w-full mt-2 text-sm">
                Run Diagnostics Again
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                <FileText className="w-4 h-4 mr-2" /> Academic Integrity Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-blue-600 hover:bg-blue-50">
                <AlertCircle className="w-4 h-4 mr-2" /> Report a Technical Issue
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}