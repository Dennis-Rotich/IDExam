import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export function ResultsCharts({ scoreTrend, subjectPerformance, overallAverage }: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* SCORE TREND */}
      <div className="border border-border rounded-lg p-5 bg-card/50 flex flex-col">
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Score Trend Over Time</h2>
        </div>
        <div className="h-[220px] w-full flex-1">
          {scoreTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }} />
                <ReferenceLine y={overallAverage} stroke="#888888" strokeDasharray="3 3" opacity={0.5} />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "var(--card)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
              Not enough graded data yet.
            </div>
          )}
        </div>
      </div>

      {/* SUBJECT PERFORMANCE */}
      <div className="border border-border rounded-lg p-5 bg-card/50 flex flex-col">
        <div className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Average by Subject</h2>
        </div>
        <div className="h-[220px] w-full flex-1">
          {subjectPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <YAxis dataKey="subject" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dx={-10} width={80} />
                <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.4 }} contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }} />
                <Bar dataKey="average" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm border border-dashed border-border rounded-lg">
              No subjects graded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}