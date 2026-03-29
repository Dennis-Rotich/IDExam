import { ArrowLeft, Edit2, Users, FileText, CheckCircle2, Copy, Eye, BookOpen, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ScrollArea } from "../components/ui/scroll-area";
import { useQuestionStore, type Question } from "../store/useQuestionStore";

// Concept: Dummy Activity Log (in a real app, this would be a real data stream)
const RECENT_ACTIVITY = [
  { id: 1, type: "exam", action: "Published Exam", item: "Final Exam Draft", time: "2 hours ago", icon: FileText },
  { id: 2, type: "question", action: "Created Question", item: "Serialize and Deserialize Binary Tree", time: "Yesterday", icon: BookOpen },
  { id: 3, type: "exam", action: "ENDED Live Exam", item: "Midterm: Data Structures", time: "2 days ago", icon: Clock },
  { id: 4, type: "question", action: "Duplicated Question", item: "Binary Tree Level Order Traversal (Copy)", time: "2 days ago", icon: Copy },
  { id: 5, type: "question", action: "Edited Details", item: "Two Sum Optimization", time: "3 days ago", icon: Edit2 },
];

export function ProfilePage() {
  // Connection point: Pull your created questions from the store
  const { questions } = useQuestionStore();

  // Filter your questions that have high usage
  const yourTopQuestions = questions
    .filter((q) => q.author === "You" && (q.usage || 0) > 0)
    .sort((a, b) => (b.usage || 0) - (a.usage || 0))
    .slice(0, 3); // Top 3

  return (
    <div className="mx-auto space-y-6 pb-12 text-foreground text-left px-2">
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-4">
          <Link to="/instructor">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
              John Doe
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-normal text-xs">
                Active Instructor
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Platform ID: inst-1 • tAhinI University Computer Science</p>
          </div>
        </div>
        <Link to="/instructor/settings">
          <Button variant="outline" className="border-border hover:bg-muted text-foreground h-9">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile Details
          </Button>
        </Link>
      </div>

      {/* --- IMPACT DASHBOARD ROW --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Published Tests", icon: FileText, value: "3 Active", desc: "2 Drafts Pending", color: "text-foreground" },
          { title: "Enrolled Candidates", icon: Users, value: "174", desc: "Across 3 Active Tests", color: "text-foreground" },
          { title: "Avg. Exam Pass Rate", icon: CheckCircle2, value: "74.2%", desc: "Mean score last 3 months", color: "text-emerald-600" },
          { title: "Question Bank Size", icon: BookOpen, value: "3 Contributions", desc: "Your unique technical questions", color: "text-foreground" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{stat.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="bg-card border-border shadow-sm text-left flex flex-col h-full lg:col-span-1">
          <CardHeader className="py-4 border-b border-border bg-muted/30">
            <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">Professional Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24 border border-border">
                <AvatarImage src="" />
                <AvatarFallback className="text-4xl bg-muted text-muted-foreground">IN</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-foreground leading-snug">Dr. John Doe, Ph.D.</h3>
                <p className="text-sm text-muted-foreground">admin@tahini.com <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5 px-1 py-0 ml-1">Verified</Badge></p>
                <p className="text-sm font-semibold text-foreground">Department / Bio</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">Head of Computer Science, Specializing in Distributed Systems & Secure Algorithm Design.</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
              Managing secure technical assessments and large-scale examination workflows.
            </div>
          </CardContent>
        </Card>

        {/* Recent Contributions Card */}
        <Card className="bg-card border-border shadow-sm text-left flex flex-col h-full lg:col-span-2">
          <CardHeader className="py-4 border-b border-border bg-muted/30">
            <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">Your Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader className="bg-muted/50 border-b border-border">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-muted-foreground font-medium">Activity</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Related Item</TableHead>
                    <TableHead className="text-muted-foreground font-medium text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_ACTIVITY.map((activity) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <TableRow key={activity.id} className="border-border hover:bg-muted/30 transition-colors">
                        <TableCell className="py-3 flex items-center gap-3">
                          <div className={`p-1.5 rounded-full ${activity.type === 'question' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                            <ActivityIcon className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-foreground font-medium text-sm">{activity.action}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm font-medium">{activity.item}</span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm font-mono">{activity.time}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

      </div>

      {/* --- TOP QUESTIONS FROM BANK STORE --- */}
      <Card className="bg-card border-border shadow-sm text-left col-span-1 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border bg-muted/30">
          <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wider">Your Question Bank Impact</CardTitle>
          <p className="text-xs text-muted-foreground">Most utilized questions across your institution's network.</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50 border-b border-border">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-medium">Question Title & category</TableHead>
                <TableHead className="text-muted-foreground font-medium text-right">Total Usage</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yourTopQuestions.length > 0 ? (
                yourTopQuestions.map((q: Question) => (
                  <TableRow key={q.id} className="border-border hover:bg-muted/50 transition-colors">
                    <TableCell className="py-3">
                      <div className="font-medium text-foreground">{q.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{q.topic}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Badge variant="outline" className="text-lg font-bold border-emerald-500/20 text-emerald-600 bg-emerald-500/10 px-2.5 py-1">
                          {q.usage}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Exams</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/instructor/questions/${q.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center p-8 text-muted-foreground text-sm">
                    No contributions found in your Question Bank.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}