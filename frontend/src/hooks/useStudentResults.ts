import { useState, useEffect } from "react";
import { getStudentSubmissionsApi } from "../api/submission";

export function useStudentResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);
        const res = await getStudentSubmissionsApi(1, 100);
        const completed = (res.data || []).filter((s: any) => 
          s.status === 'submitted' || s.status === 'graded'
        );
        setSubmissions(completed);
      } catch (error) {
        console.error("Failed to fetch results", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const gradedSubmissions = submissions.filter(s => s.status === "graded");

  // 1. KPIs
  const overallAverage = gradedSubmissions.length > 0 
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.totalScore || 0), 0) / gradedSubmissions.length) : 0;
  
  const passRate = gradedSubmissions.length > 0 
    ? Math.round((gradedSubmissions.filter(s => s.passed).length / gradedSubmissions.length) * 100) : 0;

  // 2. Score Trend
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const trendMap: Record<string, { name: string; total: number; count: number }> = {};
  [...gradedSubmissions].sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()).forEach(s => {
    const d = new Date(s.updatedAt);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    if (!trendMap[key]) trendMap[key] = { name: key, total: 0, count: 0 };
    trendMap[key].total += (s.totalScore || 0);
    trendMap[key].count += 1;
  });
  const SCORE_TREND = Object.values(trendMap).map(t => ({ name: t.name, score: Math.round(t.total / t.count) }));

  // 3. Subject Performance
  const subjectMap: Record<string, { subject: string; total: number; count: number; max: number }> = {};
  gradedSubmissions.forEach(s => {
    const subj = s.exam?.subject || "General";
    if (!subjectMap[subj]) subjectMap[subj] = { subject: subj, total: 0, count: 0, max: 0 };
    subjectMap[subj].total += (s.totalScore || 0);
    subjectMap[subj].count += 1;
    if ((s.totalScore || 0) > subjectMap[subj].max) subjectMap[subj].max = s.totalScore;
  });
  const SUBJECT_PERFORMANCE = Object.values(subjectMap).map(d => ({
    subject: d.subject, average: Math.round(d.total / d.count), max: d.max
  })).sort((a, b) => b.average - a.average);

  // 4. Test History
  const TEST_HISTORY = submissions.map(s => {
    const start = new Date(s.startedAt).getTime();
    const end = s.submittedAt ? new Date(s.submittedAt).getTime() : new Date(s.updatedAt).getTime();
    const minutes = Math.max(1, Math.floor((end - start) / 60000));
    return {
      id: s._id,
      title: s.exam?.title || "Unknown Assessment",
      subject: s.exam?.subject || "General",
      date: s.submittedAt || s.updatedAt,
      score: s.status === 'graded' ? s.totalScore : null,
      passed: s.passed || false,
      timeSpent: `${minutes}m`,
      status: s.status
    };
  });

  const uniqueSubjects = Array.from(new Set(TEST_HISTORY.map(t => t.subject)));

  return {
    isLoading,
    KPI_DATA: { overallAverage, testsCompleted: submissions.length, passRate },
    SCORE_TREND,
    SUBJECT_PERFORMANCE,
    TEST_HISTORY,
    uniqueSubjects
  };
}