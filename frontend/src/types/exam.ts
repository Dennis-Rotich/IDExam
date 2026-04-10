import { type SubmissionResponse } from "./submission";

export interface TestCase {
    _id?: string;
    input: string;
    expectedOutput?: string; // Stripped by backend for students
    isHidden?: boolean;
    points?: number;
}

// We expand the interface slightly to accommodate the Feedback Modal
export type TestAvailability = "available" | "completed" | "upcoming" | "locked";

export interface BrowseTest { 
    id: string; // The Exam ID
    submission?: SubmissionResponse | any;
    title: string; 
    subject: string; 
    instructorName: string; 
    availability: TestAvailability; 
    questionCount: number; 
    durationMinutes: number; 
    availableFrom: string; 
    dueDate: string; 
    score?: number; 
    inProgress?: boolean;
    instructorFeedback?: string; // Added for the Feedback Modal
}

export interface ExamProblem {
    _id?: string;
    title: string;
    description: string;
    testCases: TestCase[];
}

export interface Exam {
    _id: string;
    title: string;
    createdBy: string;
    durationInMinutes: number;
    problems: ExamProblem[];
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ExamResponse {
    success: boolean;
    message?: string;
    exam: Exam;
}

export interface ExamsListResponse {
    success: boolean;
    exams: Exam[];
}