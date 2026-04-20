import {apiClient} from "../lib/axiosApi";
import { 
    type LoginUserRequest, 
    type RegisterUserRequest, 
    type UpdateUserRequest,
    type AuthResponse, 
    type BaseApiResponse, 
    type UsersListResponse,
    type User
} from "../types/auth";

// AUTHENTICATION
export const registerUserApi = async (userData: RegisterUserRequest): Promise<BaseApiResponse> => {
    try {
        // Axios generic <BaseApiResponse> tells TS exactly what response.data looks like
        const response = await apiClient.post<BaseApiResponse>(`/user/register`, userData);
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const loginUserApi = async (userData: LoginUserRequest): Promise<AuthResponse> => {
    try {
        const response = await apiClient.post<AuthResponse>("/user/login", userData);
        return response.data;
    } catch (error) {
        console.error("Login API error:", error);
        throw error;
    }
};

// PROFILE MANAGEMENT
export const getUserProfileApi = async (): Promise<{ success: boolean; user: User }> => {
    try {
        const response = await apiClient.get<{ success: boolean; user: User }>("/user/profile");
        return response.data;
    } catch (error) {
        console.error("Fetch profile error:", error);
        throw error;
    }
};

export const getInstructorDashboardApi = async () => {
    try {
        const response = await apiClient.get("/user/instructor/dashboard");
        return response.data;
    } catch (error) {
        console.error("Get Instructor Dashboard API error:", error);
        throw error;
    }
};

export const updateUserApi = async (updateData: UpdateUserRequest): Promise<{ success: boolean; message: string; user: User }> => {
    try {
        const response = await apiClient.put<{ success: boolean; message: string; user: User }>("/user/profile", updateData);
        return response.data;
    } catch (error) {
        console.error("Update user error:", error);
        throw error;
    }
};

// ADMIN / INSTRUCTOR CONTROLS
export const getAllUsersApi = async (role?: string): Promise<UsersListResponse> => {
    try {
        const query = role ? `?role=${role}` : "";
        const response = await apiClient.get<UsersListResponse>(`/user/all${query}`);
        return response.data;
    } catch (error) {
        console.error("Fetch all users error:", error);
        throw error;
    }
};

export const deactivateUserApi = async (id?: string): Promise<BaseApiResponse> => {
    try {
        const url = id ? `/user/deactivate/${id}` : "/user/deactivate";
        const response = await apiClient.delete<BaseApiResponse>(url);
        return response.data;
    } catch (error) {
        console.error("Deactivate user error:", error);
        throw error;
    }
};

export const restoreUserApi = async (id: string): Promise<{ success: boolean; message: string; user: User }> => {
    try {
        const response = await apiClient.patch<{ success: boolean; message: string; user: User }>(`/user/restore/${id}`);
        return response.data;
    } catch (error) {
        console.error("Restore user error:", error);
        throw error;
    }
};

export const hardDeleteUserApi = async (id: string): Promise<BaseApiResponse> => {
    try {
        const response = await apiClient.delete<BaseApiResponse>(`/user/permanent/${id}`);
        return response.data;
    } catch (error) {
        console.error("Hard delete user error:", error);
        throw error;
    }
};