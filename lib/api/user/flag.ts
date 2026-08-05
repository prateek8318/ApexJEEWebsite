import { userClient } from "./client";
import { ApiResponse } from "../../../types/user-api";

export const userFlagApi = {
  getFlagStats: async (): Promise<ApiResponse<any>> => {
    const response = await userClient.get("/flags/stats");
    return response.data;
  },

  getFlaggedItems: async (type?: string): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    const response = await userClient.get(`/flags?${params.toString()}`);
    return response.data;
  },

  clearFlags: async (type?: string): Promise<ApiResponse<any>> => {
    const response = await userClient.delete('/flags', { data: { contentType: type } });
    return response.data;
  },

  flagQuestion: async (questionId: string, notes?: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/questions/${questionId}/flag`, { notes });
    return response.data;
  },

  unflagQuestion: async (questionId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.delete(`/questions/${questionId}/flag`);
    return response.data;
  }
};
