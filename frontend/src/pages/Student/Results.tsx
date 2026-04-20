import { BarChart2, TrendingUp, CheckCircle2, FileText, Loader2, Info } from "lucide-react";
import { useStudentResults } from "../../hooks/useStudentResults";
import { ResultsCharts } from "../../components/Student/ResultsChart";
import { SubmissionHistory } from "../../components/Student/SubmissionHistory";
import { scoreColor, getStatusIcon } from "../../utils/string";

export function StudentResultsPage() {
  const { 
    isLoading, 
    KPI_DATA, 
    SCORE_TREND, 
    SUBJECT_PERFORMANCE, 
    TEST_HISTORY, 
    uniqueSubjects 
  } = useStudentResults();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (TEST_HISTORY.length === 0) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center text-muted-foreground space-y-4">
        <Info className="w-12 h-12 opacity-20" />
        <h2 className="text-xl font-medium text-foreground">No Results Yet</h2>
        <p className="text-sm">Complete your first exam to see your performance analytics.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-10 pb-12 text-foreground text-left px-2 animate-in fade-in duration-500">
      
      {/* 1. HEADER & KPIs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BarChart2 className="h-7 w-7" /> Performance & Results
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your academic progress and analyze your strengths.</p>
        </div>
        <div className="flex flex-wrap gap-8 text-sm">
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5"/> Overall Avg</p>
            <p className={`text-2xl font-mono font-bold ${scoreColor(KPI_DATA.overallAverage)}`}>{KPI_DATA.overallAverage}%</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Pass Rate</p>
            <p className="text-2xl font-mono font-medium text-foreground">{KPI_DATA.passRate}%</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Completed</p>
            <p className="text-2xl font-mono font-medium text-foreground">{KPI_DATA.testsCompleted}</p>
          </div>
        </div>
      </div>

      {/* 2. CHARTS */}
      <ResultsCharts 
        scoreTrend={SCORE_TREND} 
        subjectPerformance={SUBJECT_PERFORMANCE} 
        overallAverage={KPI_DATA.overallAverage} 
      />

      {/* 3. HISTORY TABLE */}
      <SubmissionHistory 
        history={TEST_HISTORY} 
        uniqueSubjects={uniqueSubjects} 
        scoreColor={scoreColor}
        getStatusIcon={getStatusIcon}
      />

    </div>
  );
}