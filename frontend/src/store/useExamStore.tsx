import { create } from "zustand";
import { EXAM_QUESTIONS } from "../data/questions"; // Only needed for initial state

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface Question {
  id: string;
  code: string;
  language: string;
  isAttempted: boolean;
  description: string;
  number?: number;
}

interface ExamStore {
  // State
  questions: Question[];
  isLoading: boolean;
  currentQuestionIndex: number; // FIXED: Was '0', must be 'number'
  saveStatus: SaveStatus;
  // Actions
  setSaveStatus: (status: SaveStatus) => void;
  setQuestions: (questions: Question[]) => void;
  setCurrentQuestionIndex: (index: number) => void; 
  updateCode: (code: string) => void;
  // Helper to get the actual object safely
  getCurrentQuestion: () => Question | undefined;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  questions: [], // Start empty, let hydration handle it
  isLoading: true,
  currentQuestionIndex: 0,
  saveStatus: "idle",

  setQuestions: (fetchedQuestions) => 
    set({ questions: fetchedQuestions, isLoading: false }),

  // THE FIX: This now updates the Index.
  // We don't need to store 'currentQuestion' object separately. 
  // We can just derive it from questions[index] in the UI.
  setCurrentQuestionIndex: (index: number) => 
    set({ currentQuestionIndex: index }),

  updateCode: (newCode) =>
    set((state) => {
      // Safety check
      if (!state.questions.length) return {};

      const newQuestions = [...state.questions];
      
      newQuestions[state.currentQuestionIndex] = {
        ...newQuestions[state.currentQuestionIndex],
        code: newCode,
        isAttempted: newCode.trim().length > 0,
      };

      return { questions: newQuestions };
    }),

  setSaveStatus: (status) => set({ saveStatus: status }),

  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex];
  },
}));