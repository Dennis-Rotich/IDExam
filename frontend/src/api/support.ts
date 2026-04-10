import { apiClient } from "../lib/axiosApi";

interface SupportTicketPayload {
  subject: string;
  message: string;
}

export const submitSupportTicketApi = async (data: SupportTicketPayload) => {
  // Assuming you will create a POST route at /support/ticket on your Express backend
  const response = await apiClient.post("/support/ticket", data);
  return response.data;
};