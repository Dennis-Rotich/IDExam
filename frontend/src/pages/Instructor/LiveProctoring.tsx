import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  MonitorOff, 
  Video, 
  MessageSquare,
  EyeOff
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

// Dummy data representing the WebSocket/Polling payload from your Express backend
const ACTIVE_SESSIONS = [
  {
    id: "sess_1",
    studentName: "Alice Kimani",
    progress: "Question 3/5",
    status: "clear", // clear, warning, critical
    alerts: 0,
    cameraActive: true,
  },
  {
    id: "sess_2",
    studentName: "John Doe",
    progress: "Question 2/5",
    status: "critical",
    alerts: 3,
    lastAlert: "Tab switched (15s ago)",
    cameraActive: true,
  },
  {
    id: "sess_3",
    studentName: "Sarah Mutisya",
    progress: "Question 1/5",
    status: "warning",
    alerts: 1,
    lastAlert: "Multiple faces detected",
    cameraActive: true,
  },
  {
    id: "sess_4",
    studentName: "David Ochieng",
    progress: "Question 4/5",
    status: "critical",
    alerts: 1,
    lastAlert: "Camera disconnected",
    cameraActive: false,
  },
];

export function LiveProctoring() {
  const [sessions, setSessions] = useState(ACTIVE_SESSIONS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear": return "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20";
      case "warning": return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
      case "critical": return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear": return <CheckCircle2 className="w-4 h-4 mr-1" />;
      case "warning": return <AlertTriangle className="w-4 h-4 mr-1" />;
      case "critical": return <AlertTriangle className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Proctoring</h2>
          <p className="text-muted-foreground">Monitoring 4 active sessions for Exam: CS101 Midterm</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-1 text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
            System Normal
          </Badge>
        </div>
      </div>

      {/* Grid of Student Feeds */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sessions.map((session) => (
          <Card key={session.id} className={`border-2 ${session.status === 'critical' ? 'border-red-500/50' : 'border-transparent'}`}>
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{session.studentName}</CardTitle>
              <Badge className={getStatusColor(session.status)} variant="outline">
                {getStatusIcon(session.status)}
                {session.status.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              {/* Simulated Camera Feed */}
              <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center relative overflow-hidden border border-border">
                {session.cameraActive ? (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Video className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-xs">Feed Active</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-red-500/70">
                    <MonitorOff className="w-8 h-8 mb-2" />
                    <span className="text-xs">Feed Lost</span>
                  </div>
                )}
                
                {/* Overlay Alert if critical */}
                {session.status === 'critical' && session.lastAlert && (
                  <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 text-white text-xs p-1.5 text-center font-medium flex items-center justify-center">
                    <EyeOff className="w-3 h-3 mr-1" /> {session.lastAlert}
                  </div>
                )}
              </div>

              {/* Progress & Stats */}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">{session.progress}</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              {session.status !== 'clear' && (
                <Button variant="destructive" size="sm" className="w-full">
                  Flag
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}