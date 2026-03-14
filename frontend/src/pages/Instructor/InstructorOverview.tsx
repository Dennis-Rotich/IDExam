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
    <div className="space-y-6 px-3 py-1">
      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-4xl">
        <Card className="border-0">
          <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Candidates
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold">124</div>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold">3</div>
            <p className="text-left text-xs text-muted-foreground pt-1">
              2 Scheduled for tomorrow
            </p>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-left text-sm font-medium">
              Pending Manual Grading
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold">48</div>
            <p className="text-left text-xs text-muted-foreground pt-1">
              Requires instructor review
            </p>
          </CardContent>
        </Card>
        <Card className="border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              System Integrity
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-left text-2xl font-bold text-emerald-500">
              Secure
            </div>
            <p className="text-left text-xs text-muted-foreground pt-1">
              0 anomalous events detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="text-left grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Analytics Chart */}
        <Card className="border-0 col-span-4">
          <CardHeader>
            <CardTitle>Average Performance by Exam</CardTitle>
            <CardDescription>
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
                    stroke="#333"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "#09090b",
                      border: "1px solid #27272a",
                      borderRadius: "6px",
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
        <Card className="border-0 col-span-3">
          <CardHeader>
            <CardTitle>Action Queue</CardTitle>
            <CardDescription>
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
                    <div className="bg-muted p-2 rounded-full">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {item.student}
                      </p>
                      <p className="text-sm text-muted-foreground pt-1">
                        {item.exam} •{" "}
                        <span className="text-xs">{item.time}</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button
                variant="ghost"
                className="w-full text-sm text-muted-foreground"
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
