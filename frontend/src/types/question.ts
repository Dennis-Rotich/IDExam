export type QuestionType = "CODING" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface TestCase {
  _id?: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  points: number;
}

export interface Question {
  _id?: string;
  examId?: string;
  displayId?: number;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  
  topic?: string;
  tags?: string[];
  pointsWeight?: number;
  
  // Coding Specific
  allowedLanguages?: string[];
  starterCode?: Record<string, string>;
  referenceSolution?: string; 
  testCases?: TestCase[];
  timeLimitMs?: number;
  memoryLimitKb?: number;
  
  // MCQ / Standard Specific
  options?: string[];
  correctAnswer?: any; 
  
  isPracticeAvailable?: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}