// types/submission.ts

export type AnswerStatus = 
  | "Pending" 
  | "Accepted" 
  | "Wrong Answer" 
  | "Compilation Error" 
  | "Runtime Error" 
  | "Time Limit Exceeded";

export interface TestResult {
    _id?: string;
    testCaseId: string;
    passed: boolean;
    actualOutput?: string;
    executionTimeMs?: number;
    errorMessage?: string;
}

export interface AnswerSubmission {
    _id?: string;
    questionId: string;
    answer?: any; // Maps to Mongoose 'Mixed' (string | string[] | number | boolean)
    language?: string;
    status: AnswerStatus;
    testResults: TestResult[];
    score: number;
}

export interface Submission {
    _id: string;
    exam: string; // Will be the Exam ID, or an Exam object if populated by backend
    student: string; // Will be the Student ID, or a User object if populated
    answers: AnswerSubmission[];
    totalScore: number;
    isGraded: boolean;
    startedAt: string; // ISO Date string
    endsAt: string;    // ISO Date string
    submittedAt?: string; // ISO Date string (only present after final submission)
    createdAt?: string;
    updatedAt?: string;
}

export interface SubmissionResponse {
    success: boolean;
    message?: string;
    submission: Submission;
}

export interface SubmissionsListResponse {
    success: boolean;
    submissions: Submission[];
}