// types/auth.ts

// 1. Core Role Type (Enforces strict role checking just like the backend)
export type UserRole = "student" | "instructor" | "admin";

// 2. The Core User Object (Matches the payload returned by login and getUserProfile)
export interface User {
    id: string; 
    name: string;
    email: string;
    role: UserRole;
    institution?: string;
    avatarUrl?: string;
    studentId?: string; // Only present if role === "student"
    cohort?: string;    // Only present if role === "student"
}

// 3. The Registration Payload
export interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    institution?: string;
    avatarUrl?: string;
    // Optional fields required only for students
    studentId?: string;
    cohort?: string;
}

// 4. The Login Payload (Notice it uses 'identifier' to match the backend)
export interface LoginUserRequest {
    identifier: string; // Can be an email or a studentId
    password: string;
}

// 5. The Update Payload (Matches the backend's allowed update fields)
export interface UpdateUserRequest {
    avatarUrl?: string;
    cohort?: string;
}

// 6. The Standard API Response Wrapper (Matches your res.json() structure)
export interface BaseApiResponse {
    success: boolean;
    message?: string;
}

// 7. The Auth Response (Returned by Login)
export interface AuthResponse extends BaseApiResponse {
    token: string;
    user: User;
}

// 8. The Multiple Users Response (Returned by getAllUsersApi)
export interface UsersListResponse extends BaseApiResponse {
    count: number;
    users: User[]; // Technically these have _id from MongoDB, but frontend can treat as User
}