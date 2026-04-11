import { create } from "zustand";
import { type Question } from "../types/exam";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

// 1. Extend the base Question type to include local UI state
export interface RuntimeQuestion extends Question {
  id: string; // The mapped _id
  number: number; // For the UI (1, 2, 3...)
  isAttempted: boolean;
  // For Coding Questions
  code?: string;
  language?: string;
  // For MCQ / Short Answer / T/F
  studentAnswer?: any; 
}

interface ExamStore {
  // 2. Use RuntimeQuestion instead of Question
  questions: RuntimeQuestion[];
  isLoading: boolean;
  currentQuestionIndex: number;
  saveStatus: SaveStatus;
  
  // Actions
  setSaveStatus: (status: SaveStatus) => void;
  setQuestions: (questions: RuntimeQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void; 
  updateCode: (code: string) => void;
  updateAnswer: (answer: any) => void; // Added to support non-coding questions
  getCurrentQuestion: () => RuntimeQuestion | undefined;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  questions: [], 
  isLoading: true,
  currentQuestionIndex: 0,
  saveStatus: "idle",

  setQuestions: (fetchedQuestions) => 
    set({ questions: fetchedQuestions, isLoading: false }),

  setCurrentQuestionIndex: (index: number) => 
    set({ currentQuestionIndex: index }),

  // Updates the 'code' for coding questions
  updateCode: (newCode) =>
    set((state) => {
      if (!state.questions.length) return {};

      const newQuestions = [...state.questions];
      
      newQuestions[state.currentQuestionIndex] = {
        ...newQuestions[state.currentQuestionIndex],
        code: newCode,
        isAttempted: newCode.trim().length > 0,
      };

      return { questions: newQuestions };
    }),

  // Updates the 'studentAnswer' for MCQ, T/F, and Short Answer
  updateAnswer: (answer) =>
    set((state) => {
      if (!state.questions.length) return {};

      const newQuestions = [...state.questions];
      
      newQuestions[state.currentQuestionIndex] = {
        ...newQuestions[state.currentQuestionIndex],
        studentAnswer: answer,
        // Mark as attempted if it's a string with length, or if it's a number/boolean (index/selection)
        isAttempted: typeof answer === "string" ? answer.trim().length > 0 : answer !== undefined && answer !== null,
      };

      return { questions: newQuestions };
    }),

  setSaveStatus: (status) => set({ saveStatus: status }),

  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.currentQuestionIndex];
  },
}));