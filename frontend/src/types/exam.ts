// types/exam.ts

export interface TestCase {
    _id?: string;
    input: string;
    expectedOutput?: string; // Stripped by backend for students
    isHidden?: boolean;
    points?: number;
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