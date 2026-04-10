// api/practice.ts
import { apiClient } from "../lib/axiosApi";

export interface PracticeQuestion {
  _id: string;
  questionId: number;
  title: string;
  topic: string;
  tags: string[];
  acceptanceRate: number; 
  difficulty: "Easy" | "Medium" | "Hard";
  status: "solved" | "calendar" | "none";
}

interface FetchPracticeParams {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string | null;
}

export const getPracticeQuestionsApi = async (params: FetchPracticeParams) => {
  try {
    // Axios automatically serializes the params object into a query string:
    // /practice?page=1&limit=20&search=foo&category=Algorithms
    const response = await apiClient.get("/practice", { params });
    return response.data; // Return the whole payload to access pagination metadata
  } catch (error) {
    console.error("Fetch practice questions error:", error);
    throw error;
  }
};