import { PlayCircle, History } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

const PRACTICE_PROBLEMS = [
  { id: "P-01", title: "Recursive Tree Traversal", difficulty: "Medium", reason: "Targeted Weakness (CS301 Quiz 2)" },
  { id: "P-02", title: "Dynamic Programming: Knapsack", difficulty: "Hard", reason: "Upcoming Topic" },
  { id: "P-03", title: "Graph Cycle Detection", difficulty: "Medium", reason: "General Practice" },
];

export function StudentPractice() {
  return (
    <div className="mx-auto space-y-8 pb-12 pt-6 text-left text-slate-900 px-3">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Practice Hub</h1>
          <p className="text-slate-500 mt-1">Sharpen your skills using the exact same IDE environment as your exams.</p>
        </div>
        <Button variant="outline"><History className="w-4 h-4 mr-2"/> Practice History</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRACTICE_PROBLEMS.map((prob, i) => (
          <Card key={prob.id} className={`border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer ${i === 0 ? 'ring-1 ring-amber-400 border-amber-200' : ''}`}>
            <CardContent className="p-5">
              {i === 0 ? (
                <Badge className="mb-3 bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-medium text-xs">
                  {prob.reason}
                </Badge>
              ) : (
                <div className="mb-3 text-xs font-medium text-slate-500 uppercase tracking-wider">{prob.reason}</div>
              )}
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{prob.title}</h3>
              
              <div className="flex items-center justify-between mt-6">
                <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {prob.difficulty}
                </span>
                <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                  Solve <PlayCircle className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}