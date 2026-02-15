import { create } from 'zustand';

interface ExamState {
    code: string;
    language: string;
    timeLeft: number;
    isSaving: boolean;
    setCode: (code: string) => void;
    setLanguage: (lang: string) => void;
    decrementTime: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
    code: '',
    language: 'python',
    timeLeft: 60, // time in minutes
    isSaving: false,
    setCode: (code) => set({code}),
    setLanguage: (language) => set({language}),
    decrementTime: () => set((state) => ({ timeLeft: state.timeLeft - 1 })), 
}));