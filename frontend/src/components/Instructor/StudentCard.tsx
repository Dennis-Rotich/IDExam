import { AlertTriangle, CheckCircle2, MessageSquare, EyeOff, Keyboard, ClipboardPaste, MousePointer2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export interface ProctorSession {
  id: string;
  studentName: string;
  progress: number;
  progressText: string;
  status: "clear" | "warning" | "critical";
  alerts: number;
  lastAlert?: string;
  typingStatus: "active" | "idle" | "pasting";
  recentCode: string;
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

  const getTelemetryIcon = (typingStatus: string) => {
    switch (typingStatus) {
      case "active": return <Keyboard className="w-3 h-3 text-emerald-500 mr-1" />;
      case "pasting": return <ClipboardPaste className="w-3 h-3 text-red-500 mr-1 animate-pulse" />;
      case "idle": return <MousePointer2 className="w-3 h-3 text-amber-500 mr-1" />;
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
      <CardContent className="p-4 pt-0 space-y-4">
        
        {/* Telemetry & Code Feed */}
        <div className="w-full h-32 bg-zinc-950 rounded-md flex flex-col relative overflow-hidden border border-border/50">
          <div className="flex items-center justify-between px-2 py-1 bg-zinc-900 border-b border-zinc-800">
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider flex items-center">
              {getTelemetryIcon(session.typingStatus)}
              {session.typingStatus}
            </span>
          </div>
          <div className="p-2 text-xs font-mono text-emerald-400/80 whitespace-pre-wrap break-all opacity-80">
            {session.recentCode}
            <span className="animate-pulse">_</span>
          </div>
          
          {session.status === 'critical' && session.lastAlert && (
            <div className="absolute bottom-0 left-0 right-0 bg-red-500/90 backdrop-blur-sm text-white text-[11px] p-1.5 text-center font-medium flex items-center justify-center">
              <EyeOff className="w-3 h-3 mr-1" /> {session.lastAlert}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{session.progressText}</span>
          </div>
          <Progress value={session.progress} className="h-2" />
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