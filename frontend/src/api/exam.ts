import { apiClient } from "../lib/axiosApi";
import { type Exam, type ExamResponse, type ExamsListResponse } from "../types/exam";
import { type BrowseTest } from "../types/exam";


// CREATE
export const createExamApi = async (examData: Partial<Exam>): Promise<{success: boolean; message: string; examId: string}> => {
    try {
        const response = await apiClient.post("/exam/new", examData);
        return response.data;
    } catch (error) {
        console.error("Create Exam API error:", error);
        throw error;
    }
};

// READ (Student)
export const getExamApi = async (examId: string): Promise<ExamResponse> => {
    try {
        const response = await apiClient.get<ExamResponse>(`/exam/${examId}`);
        return response.data;
    } catch (error) {
        console.error("Get Exam API error:", error);
        throw error;
    }
};

export const getAssignedExamsApi = async (): Promise<BrowseTest[]> => {
    try {
        const response = await apiClient.get("/exam/student/assigned");
        return response.data.data;
    } catch (error) {
        console.error("Fetch Assigned Exams error:", error);
        throw error;
    }
};

// READ (Instructor)
export const getTeacherExamsApi = async (): Promise<ExamsListResponse> => {
    try {
        const response = await apiClient.get<ExamsListResponse>("/exam/teacher/all");
        return response.data;
    } catch (error) {
        console.error("Get Teacher Exams API error:", error);
        throw error;
    }
};

export const getExamForEditApi = async (examId: string): Promise<ExamResponse> => {
    try {
        const response = await apiClient.get<ExamResponse>(`/exam/teacher/${examId}`);
        return response.data;
    } catch (error) {
        console.error("Get Exam For Edit API error:", error);
        throw error;
    }
};

// UPDATE
export const updateExamApi = async (examId: string, examData: Partial<Exam>): Promise<ExamResponse> => {
    try {
        const response = await apiClient.put<ExamResponse>(`/exam/${examId}`, examData);
        return response.data;
    } catch (error) {
        console.error("Update Exam API error:", error);
        throw error;
    }
};

// DELETE
export const deleteExamApi = async (examId: string): Promise<{success: boolean; message: string}> => {
    try {
        const response = await apiClient.delete(`/exam/${examId}`);
        return response.data;
    } catch (error) {
        console.error("Delete Exam API error:", error);
        throw error;
    }
};