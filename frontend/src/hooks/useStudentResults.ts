import { useState, useEffect, useMemo } from "react";
import { getStudentSubmissionsApi } from "../api/submission";

export function useStudentResults() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // 1. Data Fetching
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

  // 2. Base Graded Submissions (Memoized)
  const gradedSubmissions = useMemo(() => {
    return submissions.filter(s => s.status === "graded");
  }, [submissions]);

  // 3. KPIs (Memoized)
  const KPI_DATA = useMemo(() => {
    const overallAverage = gradedSubmissions.length > 0 
      ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.totalScore || 0), 0) / gradedSubmissions.length) 
      : 0;
    
    const passRate = gradedSubmissions.length > 0 
      ? Math.round((gradedSubmissions.filter(s => s.passed).length / gradedSubmissions.length) * 100) 
      : 0;

    return { 
      overallAverage, 
      testsCompleted: submissions.length, 
      passRate 
    };
  }, [gradedSubmissions, submissions.length]);

  // 4. Score Trend (Memoized)
  const SCORE_TREND = useMemo(() => {
    if (gradedSubmissions.length === 0) return [];

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendMap: Record<string, { name: string; total: number; count: number }> = {};
    
    // Sort chronologically before grouping
    [...gradedSubmissions]
      .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      .forEach(s => {
        const d = new Date(s.updatedAt);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        
        if (!trendMap[key]) trendMap[key] = { name: key, total: 0, count: 0 };
        trendMap[key].total += (s.totalScore || 0);
        trendMap[key].count += 1;
      });

    return Object.values(trendMap).map(t => ({ 
      name: t.name, 
      score: Math.round(t.total / t.count) 
    }));
  }, [gradedSubmissions]);

  // 5. Subject Performance (Memoized)
  const SUBJECT_PERFORMANCE = useMemo(() => {
    if (gradedSubmissions.length === 0) return [];

    const subjectMap: Record<string, { subject: string; total: number; count: number; max: number }> = {};
    
    gradedSubmissions.forEach(s => {
      const subj = s.exam?.subject || s.exam?.courseCode || "General";
      if (!subjectMap[subj]) subjectMap[subj] = { subject: subj, total: 0, count: 0, max: 0 };
      
      const currentScore = s.totalScore || 0;
      subjectMap[subj].total += currentScore;
      subjectMap[subj].count += 1;
      if (currentScore > subjectMap[subj].max) subjectMap[subj].max = currentScore;
    });

    return Object.values(subjectMap)
      .map(d => ({
        subject: d.subject, 
        average: Math.round(d.total / d.count), 
        max: d.max
      }))
      .sort((a, b) => b.average - a.average);
  }, [gradedSubmissions]);

  // 6. Test History (Memoized)
  const TEST_HISTORY = useMemo(() => {
    return submissions.map(s => {
      const start = new Date(s.startedAt).getTime();
      const end = s.submittedAt ? new Date(s.submittedAt).getTime() : new Date(s.updatedAt).getTime();
      const minutes = Math.max(1, Math.floor((end - start) / 60000));
      
      return {
        id: s._id,
        title: s.exam?.title || "Unknown Assessment",
        subject: s.exam?.subject || s.exam?.courseCode || "General",
        date: s.submittedAt || s.updatedAt,
        rawDate: end, // Added for easier sorting in the table component
        score: s.status === 'graded' ? s.totalScore : null,
        passed: s.passed || false,
        timeSpent: `${minutes}m`,
        status: s.status
      };
    }).sort((a, b) => b.rawDate - a.rawDate); // Sort newest first automatically
  }, [submissions]);

  // 7. Unique Subjects (Memoized)
  const uniqueSubjects = useMemo(() => {
    return Array.from(new Set(TEST_HISTORY.map(t => t.subject)));
  }, [TEST_HISTORY]);

  return {
    isLoading,
    KPI_DATA,
    SCORE_TREND,
    SUBJECT_PERFORMANCE,
    TEST_HISTORY,
    uniqueSubjects
  };
} 