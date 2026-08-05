import { userClient } from "./client";
import { ApiResponse, Topic } from "../../../types/user-api";

export const userTopicApi = {
  getTopicsByChapter: async (chapterId: string, search?: string): Promise<ApiResponse<Topic[]>> => {
    const params = new URLSearchParams();
    params.append("chapter", chapterId);
    if (search) params.append("search", search);
    
    const response = await userClient.get(`/topics?${params.toString()}`);
    return response.data;
  },
  
  getTopicById: async (id: string): Promise<ApiResponse<Topic>> => {
    const response = await userClient.get(`/topics/${id}`);
    return response.data;
  },

  getTopicStats: async (id: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/topicsStats/${id}`);
    return response.data;
  },

  getTopicFlag: async (id: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/topics/${id}/flag`);
    return response.data;
  },

  updateTopicFlag: async (id: string, notes?: string): Promise<ApiResponse<any>> => {
    const response = await userClient.patch(`/topics/${id}/flag`, { notes });
    return response.data;
  }
};
