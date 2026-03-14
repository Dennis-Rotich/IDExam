import { AlertTriangle, CheckCircle2, MonitorOff, Video, MessageSquare, EyeOff } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export interface ProctorSession {
  id: string;
  studentName: string;
  progress: string;
  status: "clear" | "warning" | "critical";
  alerts: number;
  lastAlert?: string;
  cameraActive: boolean;
}

export function StudentCard({ session }: { session: ProctorSession }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "clear": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "warning": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "critical": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear": return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "warning": return <AlertTriangle className="w-3 h-3 mr-1" />;
      case "critical": return <AlertTriangle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <Card className={`border-2 transition-all ${session.status === 'critical' ? 'border-red-500/50 shadow-sm shadow-red-500/20' : 'border-transparent'}`}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold">{session.studentName}</CardTitle>
        <Badge className={getStatusColor(session.status)} variant="outline">
          {getStatusIcon(session.status)}
          {session.status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="w-full h-32 bg-muted/50 rounded-md flex items-center justify-center relative overflow-hidden border border-border/50">
          {session.cameraActive ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Video className="w-6 h-6 mb-2 opacity-40" />
              <span className="text-xs font-medium">Feed Active</span>
            </div>
          ) : (
            <div className="flex flex-col items-center text-red-500/70">
              <MonitorOff className="w-6 h-6 mb-2" />
              <span className="text-xs font-medium">Feed Lost</span>
            </div>
          )}
          {session.status === 'critical' && session.lastAlert && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 backdrop-blur-sm text-white text-[11px] p-1.5 text-center font-medium flex items-center justify-center">
              <EyeOff className="w-3 h-3 mr-1" /> {session.lastAlert}
            </div>
          )}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress:</span>
          <span className="font-medium">{session.progress}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="secondary" size="sm" className="w-full text-xs">
          <MessageSquare className="w-3 h-3 mr-2" /> Message
        </Button>
        {session.status !== 'clear' && (
          <Button variant="destructive" size="sm" className="w-full text-xs">
            Flag
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}