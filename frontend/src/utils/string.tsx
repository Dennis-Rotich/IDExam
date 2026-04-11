import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export const getInitials = (name?: string) => {
  if (!name) return "U"; 

  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export function scoreColor(score: number | null): string {
  if (score === null) return "text-muted-foreground"; // Pending
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-destructive";
}

export function getStatusIcon(score: number | null, passed: boolean, status: string) {
  if (status === "submitted") return <AlertCircle className="w-4 h-4 text-blue-500" />; // Pending grading
  if (!passed || (score !== null && score < 60)) return <XCircle className="w-4 h-4 text-destructive" />;
  if (score !== null && score >= 80) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  return <AlertCircle className="w-4 h-4 text-amber-500" />;
}

export function getDifficultyColor(diff: string) {
  if (diff === "Easy") return "text-teal-500";
  if (diff === "Medium" || diff === "Med.") return "text-amber-500";
  if (diff === "Hard") return "text-red-500";
  return "text-destructive";
}

export const generateExamCode = (courseCode: string = "") => {
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  const cleanCourse = courseCode.trim().toUpperCase();
  
  if (cleanCourse) {
    // If course code is CS101, returns CS101-A4B9
    return `${cleanCourse}-${randomStr}`;
  }
  
  // Fallback if no course code is entered
  return `EXAM-${randomStr}`;
};