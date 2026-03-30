import { Link } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle2, XCircle, AlertCircle, MessageSquare
} from "lucide-react";
import { Button } from "../../components/ui/button";

// --- MOCK DATA ---
const SUBMISSION_META = {
  title: "Midterm: Data Structures",
  subject: "CS201",
  instructor: "Dr. Sarah Okonkwo",
  dateTaken: "March 10, 2026",
  timeSpent: "85 mins",
  maxTime: "90 mins",
  studentScore: 82,
  classAverage: 74,
  percentile: "88th",
};

const QUESTION_RESULTS = [
  {
    id: "q1",
    number: 1,
    type: "MCQ",
    status: "passed",
    score: 10,
    maxScore: 10,
    timeSpent: "2m",
    prompt: "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
    studentAnswer: "O(log n)",
    correctAnswer: "O(log n)",
    feedback: null,
  },
  {
    id: "q2",
    number: 2,
    type: "Code",
    status: "partial",
    score: 15,
    maxScore: 25,
    timeSpent: "28m",
    prompt: "Write a function `hasCycle(graph)` that takes an adjacency list representation of a directed graph and returns `True` if it contains a cycle.",
    studentAnswer: "def hasCycle(graph):\n    visited = set()\n    def dfs(node):\n        if node in visited:\n            return True\n        visited.add(node)\n        for neighbor in graph.get(node, []):\n            if dfs(neighbor):\n                return True\n        return False\n\n    for start_node in graph:\n        if dfs(start_node):\n            return True\n    return False",
    correctAnswer: "# Expected: Must track the recursion stack separately from visited nodes.\ndef hasCycle(graph):\n    visited = set()\n    rec_stack = set()\n    # ... (correct implementation)",
    feedback: "Good attempt with DFS, but you forgot to remove the node from the visited set (or track the current recursion stack). This causes cross-edges to be misidentified as back-edges. Partial credit awarded for general structure.",
  },
  {
    id: "q3",
    number: 3,
    type: "MCQ",
    status: "failed",
    score: 0,
    maxScore: 10,
    timeSpent: "4m",
    prompt: "Which data structure is most optimal for implementing a priority queue?",
    studentAnswer: "Linked List",
    correctAnswer: "Binary Heap",
    feedback: "A linked list requires O(n) to insert or find the max. A binary heap does both in O(log n).",
  },
  {
    id: "q4",
    number: 4,
    type: "Code",
    status: "passed",
    score: 20,
    maxScore: 20,
    timeSpent: "15m",
    prompt: "Implement a function to reverse a singly linked list in-place.",
    studentAnswer: "def reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev",
    correctAnswer: null, 
    feedback: "Perfect, clean implementation. Optimal O(n) time and O(1) space.",
  }
];

function getStatusIcon(status: string) {
  if (status === "passed") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-destructive" />;
  return <AlertCircle className="w-4 h-4 text-amber-500" />;
}

export function StudentSubmissionDetail() {
  return (  
    <div className="mx-auto space-y-8 pb-12 text-foreground text-left px-2">
      
      {/* HEADER */}
      <div className="flex items-start gap-4 pb-6 border-b border-border">
        <Link to="/student/results">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-muted rounded-full shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{SUBMISSION_META.subject} • {SUBMISSION_META.dateTaken}</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{SUBMISSION_META.title}</h1>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div><p className="text-muted-foreground mb-1">Time</p><p className="font-mono">{SUBMISSION_META.timeSpent}</p></div>
            <div><p className="text-muted-foreground mb-1">Class Avg</p><p className="font-mono">{SUBMISSION_META.classAverage}%</p></div>
            <div><p className="text-muted-foreground mb-1">Score</p><p className="text-2xl font-mono font-medium text-emerald-500">{SUBMISSION_META.studentScore}%</p></div>
          </div>
        </div>
      </div>

      {/* QUESTION BREAKDOWN (Flat List Style) */}
      <div className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Submission Breakdown</h2>
        
        <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
          {QUESTION_RESULTS.map((q) => (
            <div key={q.id} className="flex flex-col bg-card/50">
              
              {/* Question Header */}
              <div className="p-4 bg-muted/10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(q.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <span>{q.number}.</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">{q.type}</span>
                    </div>
                    <p className="text-sm text-foreground mt-2 leading-relaxed max-w-3xl">{q.prompt}</p>
                  </div>
                </div>
                <div className="text-sm font-mono text-muted-foreground shrink-0">{q.score} / {q.maxScore}</div>
              </div>
              
              {/* Answer Area */}
              <div className="p-4 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Output</p>
                  {q.type === "Code" ? (
                    <div className="bg-[#1e1e1e] border border-border rounded-md p-4 overflow-x-auto">
                      <pre className="text-sm font-mono text-[#d4d4d4]"><code>{q.studentAnswer}</code></pre>
                    </div>
                  ) : (
                    <div className="bg-background border border-border rounded-md p-3 text-sm text-foreground">{q.studentAnswer}</div>
                  )}
                </div>

                {q.correctAnswer && (
                  <div className="flex-1 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expected</p>
                    {q.type === "Code" ? (
                      <div className="bg-[#1e1e1e] border border-border rounded-md p-4 overflow-x-auto">
                        <pre className="text-sm font-mono text-emerald-500"><code>{q.correctAnswer}</code></pre>
                      </div>
                    ) : (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-md p-3 text-sm text-emerald-600 dark:text-emerald-400">{q.correctAnswer}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback Area */}
              {q.feedback && (
                <div className="px-4 pb-4">
                  <div className="border border-blue-500/20 bg-blue-500/5 rounded-md p-4 flex gap-3">
                    <MessageSquare className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Instructor Note</p>
                      <p className="text-sm text-foreground leading-relaxed">{q.feedback}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}