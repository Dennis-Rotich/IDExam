import { apiClient } from "../lib/axiosApi";
import { type Question } from "../types/exam"; // Your newly updated interface

export const getInstructorQuestionsApi = async () => {
  const response = await apiClient.get("/question/instructor"); 
  return response.data.data || response.data.questions || response.data;
};

export const getQuestionApi = async (id: string) => {
  const response = await apiClient.get(`/question/${id}`);
  return response.data;
};

export const createQuestionApi = async (questionData: Partial<Question>) => {
  const response = await apiClient.post("/question", questionData);
  return response.data;
};

export const updateQuestionApi = async (id: string, questionData: Partial<Question>) => {
  const response = await apiClient.put(`/question/${id}`, questionData);
  return response.data;
};

export const deleteQuestionApi = async (id: string) => {
  const response = await apiClient.delete(`/question/${id}`);
  return response.data;
};