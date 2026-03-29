import { create } from "zustand";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "Code" | "MCQ";

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface Question {
  id: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  author: string;
  usage: number;
  lastModified: string;
  type: QuestionType;
  description?: string;
  starterCode?: string;
  referenceSolution?: string;
  testCases?: TestCase[];
  pointsWeight?: number;
}

interface QuestionState {
  questions: Question[];
  activeQuestion: Question | null;
  
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

const INITIAL_QUESTIONS: Question[] = [
  { 
    id: "Q-1029", title: "Two Sum Optimization", topic: "Arrays & Hashing", difficulty: "Easy", 
    author: "You", usage: 12, lastModified: "2 days ago", type: "Code", pointsWeight: 15,
    description: "Given an array...", starterCode: "# Write code", referenceSolution: "# Solution",
    testCases: [{ id: "tc-1", input: "nums = [2,7], target = 9", expectedOutput: "[0,1]", isHidden: false }]
  },
  { id: "Q-1030", title: "Implement LRU Cache", topic: "System Design", difficulty: "Medium", author: "You", usage: 5, lastModified: "1 week ago", type: "Code" },
];

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: INITIAL_QUESTIONS,
  activeQuestion: null,

  setActiveQuestion: (id) => {
    if (!id) return set({ activeQuestion: null });
    set({ activeQuestion: get().questions.find(q => q.id === id) || null });
  },

  createDraft: () => set({
    activeQuestion: {
      id: "draft", title: "", topic: "", difficulty: "Medium", author: "You",
      usage: 0, lastModified: "Just now", type: "Code", testCases: [], pointsWeight: 10
    }
  }),

  updateActiveQuestion: (data) => set((state) => ({
    activeQuestion: state.activeQuestion ? { ...state.activeQuestion, ...data } : null
  })),

  saveActiveQuestion: () => set((state) => {
    if (!state.activeQuestion) return state;
    const isNew = state.activeQuestion.id === "draft";
    const savedQuestion = {
      ...state.activeQuestion,
      id: isNew ? `Q-${Math.floor(1000 + Math.random() * 9000)}` : state.activeQuestion.id,
      lastModified: "Just now"
    };

    return {
      activeQuestion: savedQuestion,
      questions: isNew 
        ? [savedQuestion, ...state.questions] 
        : state.questions.map(q => q.id === savedQuestion.id ? savedQuestion : q)
    };
  }),

  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter(q => q.id !== id),
  })),

  duplicateQuestion: (id) => {
    const source = get().questions.find(q => q.id === id);
    if (!source) return;
    const duplicate = { ...source, id: `Q-${Math.floor(1000 + Math.random() * 9000)}`, title: `${source.title} (Copy)`, author: "You", usage: 0, lastModified: "Just now" };
    set((state) => ({ questions: [duplicate, ...state.questions] }));
  },

  addTestCase: () => set((state) => {
    if (!state.activeQuestion) return state;
    const newTC: TestCase = { id: `tc-${Math.random().toString(36).substring(2, 9)}`, input: "", expectedOutput: "", isHidden: false };
    return { activeQuestion: { ...state.activeQuestion, testCases: [...(state.activeQuestion.testCases || []), newTC] } };
  }),

  updateTestCase: (tcId, data) => set((state) => {
    if (!state.activeQuestion) return state;
    return {
      activeQuestion: {
        ...state.activeQuestion,
        testCases: state.activeQuestion.testCases?.map(tc => tc.id === tcId ? { ...tc, ...data } : tc)
      }
    };
  }),

  removeTestCase: (tcId) => set((state) => {
    if (!state.activeQuestion) return state;
    return {
      activeQuestion: { ...state.activeQuestion, testCases: state.activeQuestion.testCases?.filter(tc => tc.id !== tcId) }
    };
  }),
}));