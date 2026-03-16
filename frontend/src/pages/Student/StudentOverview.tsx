import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const Q_PERFORMANCE = [
  { id: "Q1", score: 10, max: 10, color: "bg-emerald-500" },
  { id: "Q2", score: 16, max: 20, color: "bg-emerald-500" },
  { id: "Q3", score: 14, max: 25, color: "bg-amber-500" }, 
  { id: "Q4", score: 15, max: 15, color: "bg-emerald-500" },
];

export function StudentOverview() {
  return (
    <div className="mx-auto space-y-8 pb-12 pt-6 text-slate-900 text-left px-3">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Hey, Isaiah</h1>
        <p className="text-slate-500 mt-1">You have 1 upcoming exam and 1 result ready to view</p>
      </div>

      {/* UPCOMING EXAM & ENV CHECK */}
      <Card className="border-blue-200 bg-blue-50/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <span className="text-blue-700 font-semibold tracking-wider text-xs uppercase">Upcoming</span>
              <h2 className="text-2xl font-bold text-slate-900">CS301 — Midterm</h2>
              <p className="text-slate-600 text-sm">Today • 2:00 PM - 3:30 PM • 90 min • 5 questions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 text-white rounded-lg p-3 text-center shadow-inner min-w-[140px]">
                <div className="text-2xl font-mono font-medium tracking-tight">01:12:34</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Until exam opens</div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 shadow-sm">Check in</Button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-blue-200/60">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <span className="font-medium text-slate-700">Environment check</span>
              <div className="flex items-center text-emerald-600"><CheckCircle2 className="w-4 h-4 mr-1.5" />Browser compatible</div>
              <div className="flex items-center text-emerald-600"><CheckCircle2 className="w-4 h-4 mr-1.5" />Camera & mic ready</div>
              <div className="flex items-center text-amber-600 font-medium"><AlertTriangle className="w-4 h-4 mr-1.5" />Stable internet</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QUICK STATS */}
      <div className="grid grid-cols-3 gap-6 py-2">
        <div>
          <p className="text-sm font-medium text-slate-500">Overall average</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">78<span className="text-lg text-slate-500 font-normal">%</span></p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Exams completed</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">3 <span className="text-lg text-slate-500 font-normal">of 5</span></p>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Practice problems done</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">14</p>
        </div>
      </div>

      {/* LATEST RESULT CARD */}
      <Card className="bg-white border-slate-200 shadow-sm">
        <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-slate-100">
          <CardTitle className="text-base font-medium text-slate-700">Latest result — CS301 Quiz 2</CardTitle>
          <Button variant="link" className="text-blue-600 h-auto p-0 font-medium text-sm">
            View full feedback <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-3 text-center md:text-left">
              <div className="text-6xl font-bold text-emerald-600 tracking-tighter">82<span className="text-3xl text-emerald-600/60">%</span></div>
            </div>
            <div className="md:col-span-5 space-y-3">
              {Q_PERFORMANCE.map((q) => (
                <div key={q.id} className="flex items-center gap-3 text-sm">
                  <span className="text-slate-500 font-medium w-6">{q.id}</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${q.color} rounded-full`} style={{ width: `${(q.score / q.max) * 100}%` }} />
                  </div>
                  <span className="text-slate-700 w-10 text-right">{q.score}/{q.max}</span>
                </div>
              ))}
            </div>
            <div className="md:col-span-4 bg-amber-50/50 border border-amber-100 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" /> Weak area flagged
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                <strong className="text-slate-900 font-medium">Recursion</strong> — below class avg by 18 pts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PROFESSOR NOTICE */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">Notice from Prof. Chen</h4>
        <p className="text-sm text-slate-600">Midterm covers weeks 1-6. Allowed: one handwritten cheat sheet (A4, both sides). No IDE autocomplete.</p>
        <p className="text-xs text-slate-400 mt-3">Posted 2 days ago</p>
      </div>
    </div>
  );
}