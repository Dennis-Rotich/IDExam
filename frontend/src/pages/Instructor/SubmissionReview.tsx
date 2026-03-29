import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Clock, AlertTriangle, Save, AlignLeft, Code2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

// --- DUMMY DATA ---
const SUBMISSION = {
  studentName: "Jaylen Brooks",
  examTitle: "CS301: Data Structures Midterm",
  submittedAt: "2:45 PM, Mar 24",
  duration: "85 mins",
  autoGrade: 78,
  status: "Needs Manual Review",
  questions: [
    { id: "q1", number: 1, title: "Binary Search Implementation", status: "passed", autoScore: 20, maxScore: 20 },
    { id: "q2", number: 2, title: "Graph Cycle Detection", status: "partial", autoScore: 10, maxScore: 25 },
    { id: "q3", number: 3, title: "Dynamic Programming Knapsack", status: "failed", autoScore: 0, maxScore: 30 },
  ]
};

const Q2_DETAILS = {
  description: "Write a function `hasCycle(graph)` that takes an adjacency list representation of a directed graph and returns `True` if it contains a cycle, and `False` otherwise.",
  studentCode: `def hasCycle(graph):\n    visited = set()\n    \n    def dfs(node):\n        if node in visited:\n            return True\n        visited.add(node)\n        for neighbor in graph.get(node, []):\n            if dfs(neighbor):\n                return True\n        # BUG: Missing visited.remove(node) for cross-edges\n        return False\n\n    for start_node in graph:\n        if dfs(start_node):\n            return True\n            \n    return False`,
  testCases: [
    { id: 1, input: "{1: [2], 2: [3], 3: [1]}", expected: "True", result: "True", passed: true },
    { id: 2, input: "{1: [2, 3], 2: [4], 3: [4], 4: []}", expected: "False", result: "True", passed: false }, // Cross-edge bug caught here
    { id: 3, input: "{}", expected: "False", result: "False", passed: true },
  ]
};

export function StudentSubmissionReview() {
  const [activeQuestion, setActiveQuestion] = useState("q2");
  const [manualScore, setManualScore] = useState<string>("10");

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground px-2 h-[calc(100vh-60px)] flex flex-col text-left">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-border shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/instructor/exams">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
              {SUBMISSION.studentName} 
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-medium px-2 py-0 text-[10px]">{SUBMISSION.status}</Badge>
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span>{SUBMISSION.examTitle}</span> • 
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {SUBMISSION.duration}</span> • 
              <span>{SUBMISSION.submittedAt}</span>
            </p>
          </div>
        </div>
        <div className="text-right flex gap-6">
          <div><p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">System Grade</p><p className="text-xl font-bold text-foreground font-mono">{SUBMISSION.autoGrade}<span className="text-sm text-muted-foreground font-sans"> / 100</span></p></div>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* LEFT: Question Navigation (Flat List) */}
        <div className="w-64 shrink-0 flex flex-col gap-1 overflow-y-auto pr-2 border-r border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">Questions</h3>
          {SUBMISSION.questions.map((q) => (
            <button
              key={q.id} onClick={() => setActiveQuestion(q.id)}
              className={`text-left p-3 rounded-md transition-colors outline-none ${
                activeQuestion === q.id ? "bg-muted/50" : "bg-transparent hover:bg-muted/30"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-medium text-sm ${activeQuestion === q.id ? "text-foreground" : "text-foreground/80"}`}>Q{q.number}</span>
                <span className={`text-xs font-mono font-medium ${
                  q.status === 'passed' ? 'text-emerald-500' : q.status === 'failed' ? 'text-destructive' : 'text-amber-500'
                }`}>{q.autoScore}/{q.maxScore}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{q.title}</p>
            </button>
          ))}
        </div>

        {/* RIGHT: Active Question Details */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-6">
          
          {/* Prompt */}
          <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden shrink-0">
            <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <AlignLeft className="w-3.5 h-3.5" /> Prompt
            </div>
            <div className="p-4 text-sm text-foreground leading-relaxed">{Q2_DETAILS.description}</div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 flex-1 min-h-[400px]">
            {/* Student Code */}
            <div className="flex flex-col border border-border rounded-lg overflow-hidden h-full">
              <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Code2 className="w-3.5 h-3.5" /> Submission</div>
                <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded">Python 3</span>
              </div>
              <div className="flex-1 bg-[#1e1e1e]">
                <textarea readOnly value={Q2_DETAILS.studentCode} className="w-full h-full p-4 bg-transparent text-[#d4d4d4] font-mono text-sm border-none focus:ring-0 resize-none outline-none" />
              </div>
            </div>

            {/* Grading & Tests */}
            <div className="flex flex-col gap-6 h-full">
              {/* Test Cases */}
              <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden shrink-0">
                <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Execution Results</div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-normal px-2 py-0 text-[10px]">Partial Pass</Badge>
                </div>
                <div className="divide-y divide-border">
                  {Q2_DETAILS.testCases.map((tc) => (
                    <div key={tc.id} className="p-3 text-sm flex items-start gap-3 bg-transparent">
                      <div className="mt-0.5">{tc.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-destructive" />}</div>
                      <div className="flex-1 space-y-1 font-mono text-xs">
                        <div className="text-muted-foreground">In: <span className="text-foreground">{tc.input}</span></div>
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">Exp: <span className="text-emerald-500">{tc.expected}</span></span>
                          <span className="text-muted-foreground">Got: <span className={tc.passed ? "text-emerald-500" : "text-destructive"}>{tc.result}</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manual Override */}
              <div className="flex flex-col border border-border rounded-lg bg-card/30 overflow-hidden flex-1">
                <div className="py-2 px-4 bg-muted/10 border-b border-border flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Manual Override</div>
                  <div className="flex items-center gap-2">
                    <Input type="number" value={manualScore} onChange={(e) => setManualScore(e.target.value)} className="w-16 h-7 text-right bg-background border-border text-foreground font-mono text-xs" />
                    <span className="text-muted-foreground text-xs font-mono">/ 25</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  {Q2_DETAILS.testCases.some(tc => !tc.passed) && (
                    <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-md flex gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-600 dark:text-amber-500">Failed test case #2. Algorithm does not handle cross-edges in directed graphs properly, resulting in false positives.</p>
                    </div>
                  )}
                  <Textarea 
                    placeholder="Leave feedback for the student regarding this question..."
                    className="flex-1 bg-background border-border text-foreground resize-none text-sm p-3 focus-visible:ring-1 focus-visible:ring-border"
                    defaultValue="Good attempt with DFS, but you forgot to remove the node from the visited set after the recursive call returns. This causes cross-edges to be misidentified as back-edges (cycles). Giving partial credit for the general structure."
                  />
                  <div className="flex justify-end pt-1">
                    <Button className="bg-foreground text-background hover:bg-foreground/90 h-8 rounded-full px-5 text-xs">
                      <Save className="w-3.5 h-3.5 mr-2" /> Save Draft
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}