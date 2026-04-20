import { apiClient } from "../lib/axiosApi";
import { type Question } from "../types/exam"; // Your newly updated interface

// Define the exact parameters your backend expects
export interface GetQuestionsParams {
    page?: number;
    limit?: number;
    tags?: string; // Comma-separated string, e.g., "react,javascript"
    search?: string;
};

// get questions by the instructor in session
export const getInstructorQuestionsApi = async () => {
  const response = await apiClient.get("/question/instructor"); 
  return response.data.data || response.data.questions || response.data;
};

export const getQuestionApi = async (id: string) => {
  const response = await apiClient.get(`/question/${id}`);
  return response.data;
};

// get all questions in the question bank
export const getQuestionsApi = async (params: GetQuestionsParams = {}) => {
    try {
        // Axios automatically converts the `params` object into query strings
        const response = await apiClient.get(`/question`, { params });
        return response.data;
    } catch (error) {
        console.error("Get Questions API error:", error);
        throw error;
    }
};

export const createQuestionApi = async (questionData: any) => {
    try {
        const response = await apiClient.post("/question/new", questionData);
        return response.data;
    } catch (error) {
        console.error("Create Question API error:", error);
        throw error;
    }
};

export const updateQuestionApi = async (id: string, questionData: Partial<Question>) => {
  const response = await apiClient.put(`/question/${id}`, questionData);
  return response.data;
};

export const deleteQuestionApi = async (id: string) => {
  const response = await apiClient.delete(`/question/${id}`);
  return response.data;
};