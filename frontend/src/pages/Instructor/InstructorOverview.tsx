import { Activity, Users, FileText, AlertCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../../components/ui/button";

// Dummy Analytics Data
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
];

export function InstructorOverview() {
  return (
    <div className="space-y-6 px-3 py-1 text-slate-900">
      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Active Candidates
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold text-slate-900">124</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Exams</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold text-slate-900">3</div>
            <p className="text-left text-xs text-slate-500 pt-1">
              2 Scheduled for tomorrow
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-left text-sm font-medium text-slate-600">
              Pending Manual Grading
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold text-slate-900">48</div>
            <p className="text-left text-xs text-slate-500 pt-1">
              Requires instructor review
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              System Integrity
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold text-emerald-600">
              Secure
            </div>
            <p className="text-left text-xs text-slate-500 pt-1">
              0 anomalous events detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="text-left grid gap-4 md:grid-cols-2 lg:grid-cols-7 max-w-6xl">
        
        {/* Analytics Chart */}
        <Card className="bg-white border-slate-200 shadow-sm col-span-4">
          <CardHeader>
            <CardTitle className="text-slate-800">Average Performance by Exam</CardTitle>
            <CardDescription className="text-slate-500">
              Mean score distribution across recent examination instances.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0" // Light mode grid lines
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b" // Light mode text
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#64748b" // Light mode text
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.04)" }} // Subtle hover effect
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      color: "#0f172a",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="avgScore"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Average Score"
                  />
                  <Bar
                    dataKey="highest"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Highest Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Queue / Recent Activity */}
        <Card className="bg-white border-slate-200 shadow-sm col-span-3">
          <CardHeader>
            <CardTitle className="text-slate-800">Action Queue</CardTitle>
            <CardDescription className="text-slate-500">
              Submissions requiring manual override or grading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pendingGrading.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                      <Clock className="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none text-slate-900">
                        {item.student}
                      </p>
                      <p className="text-sm text-slate-500 pt-1">
                        {item.exam} •{" "}
                        <span className="text-xs">{item.time}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                    Review
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <Button
                variant="ghost"
                className="w-full text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                View All Pending (48)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}