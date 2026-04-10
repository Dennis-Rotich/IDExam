// api/submission.ts
import { apiClient } from "../lib/axiosApi";
import {type SubmissionResponse, type SubmissionsListResponse, type AnswerSubmission } from "../types/submission";

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

// Autosave progress (updates the 'answers' array dynamically)
export const autosaveAnswersApi = async (
    submissionId: string, 
    answers: Partial<AnswerSubmission>[]
): Promise<{ success: boolean; message: string }> => {
    try {
        // We typically don't need the full object back on a silent autosave, just a success ping
        const response = await apiClient.put<{ success: boolean; message: string }>(
            `/submission/${submissionId}/autosave`, 
            { answers }
        );
        return response.data;
    } catch (error) {
        console.error("Autosave API error:", error);
        throw error;
    }
};

// Finalize and submit the exam
export const submitExamApi = async (submissionId: string): Promise<SubmissionResponse> => {
    try {
        const response = await apiClient.post<SubmissionResponse>(`/submission/${submissionId}/submit`);
        return response.data;
    } catch (error) {
        console.error("Submit Exam API error:", error);
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
// Fetch all submissions for a specific exam (for grading/review)
export const getExamSubmissionsApi = async (examId: string): Promise<SubmissionsListResponse> => {
    try {
        const response = await apiClient.get<SubmissionsListResponse>(`/submission/exam/${examId}`);
        return response.data;
    } catch (error) {
        console.error("Get Exam Submissions API error:", error);
        throw error;
    }
};

// Fetch all submissions for the currently logged-in student (with pagination)
export const getStudentSubmissionsApi = async (page = 1, limit = 10): Promise<any> => {
    try {
        const response = await apiClient.get(`/submission/student/me?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Get Student Submissions API error:", error);
        throw error;
    }
};