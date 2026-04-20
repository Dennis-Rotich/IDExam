// api/settings.ts
import { apiClient } from "../lib/axiosApi";

export const updateProfileApi = async (data: { name?: string; bio?: string; language?: string }) => {
  const response = await apiClient.put("/user/profile", data);
  return response.data;
};

export const updatePasswordApi = async (data: { currentPassword: string; newPassword: string }) => {
  const response = await apiClient.put("/user/password", data);
  return response.data;
};

export const updatePreferencesApi = async (preferences: any) => {
  const response = await apiClient.put("/user/preferences", preferences);
  return response.data;
};