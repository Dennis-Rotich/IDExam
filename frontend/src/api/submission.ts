// api/submission.ts
import { apiClient } from "../lib/axiosApi";
import { type SubmissionResponse, type SubmissionsListResponse } from "../types/submission";

// STUDENT ACTIONS
// Start a new exam session (creates the initial Submission document)
export const startSubmissionApi = async (examId: string): Promise<SubmissionResponse> => {
    try {
        const response = await apiClient.post<SubmissionResponse>("/submission/start", { examId });
        return response.data;
    } catch (error) {
        console.error("Start Submission API error:", error);
        throw error;
    }
};

// For the "Run" button (Dry run)
export const runCodeApi = async (language: string, code: string) => {
    const response = await apiClient.post(`/submission/run`, { language, code });
    return response.data;
};

// For auto-syncing every few seconds
export const autosaveApi = async (sessionId: string, questionId: string, language: string, answer: string) => {
    const response = await apiClient.post(`/submission/autosave/${sessionId}`, { questionId, language, answer });
    return response.data;
};

// For the final "Finish Exam" button
export const finalizeExamApi = async (sessionId: string) => {
    const response = await apiClient.post(`/submission/finalize/${sessionId}`);
    return response.data;
};

// NEW: Submit a specific question for actual grading
export const submitQuestionApi = async (
    sessionId: string, 
    questionId: string,
    language: string,
    code: string
): Promise<any> => {
    try {
        const response = await apiClient.post(
            `/submission/submit/${sessionId}`, 
            { questionId, language, code }
        );
        return response.data;
    } catch (error) {
        console.error("Submit Question API error:", error);
        throw error;
    }
};

// Get a specific submission (for a student reviewing their results)
export const getStudentSubmissionApi = async (submissionId: string): Promise<SubmissionResponse> => {
    try {
        const response = await apiClient.get<SubmissionResponse>(`/submission/${submissionId}`);
        return response.data;
    } catch (error) {
        console.error("Get Student Submission API error:", error);
        throw error;
    }
};

// INSTRUCTOR ACTIONS
export const getExamSubmissionsApi = async (examId: string): Promise<SubmissionsListResponse> => {
    try {
        const response = await apiClient.get<SubmissionsListResponse>(`/submission/exam/${examId}`);
        return response.data;
    } catch (error) {
        console.error("Get Exam Submissions API error:", error);
        throw error;
    }
};

export const getStudentSubmissionsApi = async (page = 1, limit = 10): Promise<any> => {
    try {
        const response = await apiClient.get(`/submission/student/me?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Get Student Submissions API error:", error);
        throw error;
    }
};