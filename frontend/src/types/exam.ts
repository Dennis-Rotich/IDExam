import { type SubmissionResponse } from "./submission";
import { type User } from "./auth";

export interface TestCase {
  _id?: string;
  input: string;
  expectedOutput?: string; // Stripped by backend for students
  isHidden?: boolean;
  points?: number;
}

// We expand the interface slightly to accommodate the Feedback Modal
export type TestAvailability =
  | "available"
  | "completed"
  | "upcoming"
  | "locked";

export interface BrowseTest {
  id: string; // The Exam ID
  submission?: SubmissionResponse | any;
  title: string;
  subject: string;
  instructorName: string;
  availability: TestAvailability;
  questionCount: number;
  durationMinutes: number;
  availableFrom: string;
  dueDate: string;
  score?: number;
  inProgress?: boolean;
  instructorFeedback?: string; // Added for the Feedback Modal
}

export interface Question {
  _id?: string;
  displayId?: number; // Usually auto-generated or assigned later
  title: string;
  description: string;
  // Enforced Unions matching Mongoose enums
  type: "CODING" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  difficulty: "Easy" | "Medium" | "Hard";
  topic?: string;
  tags?: string[];
  pointsWeight?: number;
  // --- TYPE A: coding specific fields (Optional) ---
  allowedLanguages?: string[];
  // Record<string, string> perfectly maps to Mongoose's Map of Strings
  starterCode?: Record<string, string>; 
  referenceSolution?: string;
  testCases?: TestCase[];
  timeLimitMs?: number;
  memoryLimitKb?: number;
  // --- TYPE B: multiple choice / standard fields (Optional) ---
  options?: string[];
  // Mixed type allows index (number), short text (string), or T/F (boolean)
  correctAnswer?: string | number | boolean; 
  isPracticeAvailable?: boolean;
  createdBy?: string | User;
}

export interface Exam {
  _id: string;
  title: string;
  examCode: string;
  courseCode: string;
  instructions?: string;
  createdBy: string;
  durationInMinutes: number;
  // --- newly added fields matching schema ---
  availableFrom?: string; // Stored as ISO string on the frontend
  availableUntil?: string; // Stored as ISO string on the frontend
  aiProctoringEnabled?: boolean;
  aiGradingEnabled?: boolean;
  assignedCohorts?: string[];
  // ----------------------------------------
  // Note: Depending on the API call, this might be an array of ObjectIds (string[]) 
  questions: Question[]; 
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamResponse {
  success: boolean;
  message?: string;
  exam: Exam;
}

export interface ExamsListResponse {
  success: boolean;
  exams: Exam[];
}
