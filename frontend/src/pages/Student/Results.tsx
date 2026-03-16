import { FileText } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

const PAST_RESULTS = [
  { id: "EX-098", course: "CS301: Algorithms", title: "Quiz 2", date: "Mar 10, 2026", score: 82, avg: 74 },
  { id: "EX-097", course: "CS301: Algorithms", title: "Quiz 1", date: "Feb 28, 2026", score: 91, avg: 80 },
  { id: "EX-096", course: "CS205: Data Structures", title: "Final Exam", date: "Dec 15, 2025", score: 88, avg: 76 },
];

export function StudentResults() {
  return (
    <div className="mx-auto space-y-8 pb-12 pt-6 text-slate-900 text-left px-3">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Results & Feedback</h1>
        <p className="text-slate-500 mt-1">Review your past performance and instructor feedback.</p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="text-slate-600">Course & Exam</TableHead>
              <TableHead className="text-slate-600">Date</TableHead>
              <TableHead className="text-slate-600 text-center">Class Avg</TableHead>
              <TableHead className="text-right text-slate-600">Your Score</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAST_RESULTS.map((result) => (
              <TableRow key={result.id} className="border-slate-100">
                <TableCell>
                  <div className="font-medium text-slate-900">{result.title}</div>
                  <div className="text-xs text-slate-500">{result.course}</div>
                </TableCell>
                <TableCell className="text-slate-600">{result.date}</TableCell>
                <TableCell className="text-center text-slate-500">{result.avg}%</TableCell>
                <TableCell className="text-right">
                  <span className={`font-bold ${result.score >= result.avg ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {result.score}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="text-xs">
                    <FileText className="w-3 h-3 mr-2" /> Feedback
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}