import { create } from "zustand";
import { type Question } from "../types/exam";

// Updated to use _id to match MongoDB ObjectId strings
export interface TestCase {
  _id?: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

interface QuestionState {
  questions: Question[];
  activeQuestion: Question | null;
  
  // Added to support fetching from the API in QuestionBank
  setQuestions: (questions: Question[]) => void; 
  
  setActiveQuestion: (id: string | null) => void;
  createDraft: () => void;
  updateActiveQuestion: (data: Partial<Question>) => void;
  saveActiveQuestion: () => void;
  deleteQuestion: (id: string) => void;
  duplicateQuestion: (id: string) => void;
  
  addTestCase: () => void;
  updateTestCase: (testCaseId: string, data: Partial<TestCase>) => void;
  removeTestCase: (testCaseId: string) => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  // Start empty, as QuestionBank will fetch and hydrate this via setQuestions
  questions: [], 
  activeQuestion: null,

  setQuestions: (questions) => set({ questions }),

  setActiveQuestion: (id) => {
    if (!id) return set({ activeQuestion: null });
    set({ activeQuestion: get().questions.find(q => q._id === id) || null });
  },

  createDraft: () => set({
    activeQuestion: {
      _id: "draft", 
      title: "", 
      description: "",
      topic: "", 
      difficulty: "Medium", 
      type: "CODING", // Enforced union type
      testCases: [], 
      pointsWeight: 10,
      isPracticeAvailable: true,
      timeLimitMs: 2000,
      memoryLimitKb: 256000,
      allowedLanguages: ["javascript", "python"],
      starterCode: {} 
    }
  }),

  updateActiveQuestion: (data) => set((state) => ({
    activeQuestion: state.activeQuestion ? { ...state.activeQuestion, ...data } : null
  })),

  // Note: This does a local optimistic save. 
  // You will still need to call your API controller to save to MongoDB.
  saveActiveQuestion: () => set((state) => {
    if (!state.activeQuestion) return state;
    const isNew = state.activeQuestion._id === "draft";
    
    const savedQuestion = {
      ...state.activeQuestion,
      // Assign a temporary ID if local; backend will replace this with a real ObjectId
      _id: isNew ? `temp-${Date.now()}` : state.activeQuestion._id, 
    };

    return {
      activeQuestion: savedQuestion,
      questions: isNew 
        ? [savedQuestion, ...state.questions] 
        : state.questions.map(q => q._id === savedQuestion._id ? savedQuestion : q)
    };
  }),

  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter(q => q._id !== id),
  })),

  duplicateQuestion: (id) => {
    const source = get().questions.find(q => q._id === id);
    if (!source) return;
    
    const duplicate: Question = { 
      ...source, 
      _id: `temp-${Date.now()}`, 
      title: `${source.title} (Copy)`,
      displayId: undefined // Strip this so MongoDB generates a fresh one
    };
    
    set((state) => ({ questions: [duplicate, ...state.questions] }));
  },

  addTestCase: () => set((state) => {
    if (!state.activeQuestion) return state;
    const newTC: TestCase = { 
      _id: `tc-temp-${Math.random().toString(36).substring(2, 9)}`, 
      input: "", 
      expectedOutput: "", 
      isHidden: false 
    };
    return { 
      activeQuestion: { 
        ...state.activeQuestion, 
        testCases: [...(state.activeQuestion.testCases || []), newTC] 
      } 
    };
  }),

  updateTestCase: (tcId, data) => set((state) => {
    if (!state.activeQuestion) return state;
    return {
      activeQuestion: {
        ...state.activeQuestion,
        testCases: state.activeQuestion.testCases?.map(tc => 
          tc._id === tcId ? { ...tc, ...data } : tc
        )
      }
    };
  }),

  removeTestCase: (tcId) => set((state) => {
    if (!state.activeQuestion) return state;
    return {
      activeQuestion: { 
        ...state.activeQuestion, 
        testCases: state.activeQuestion.testCases?.filter(tc => tc._id !== tcId) 
      }
    };
  }),
}));