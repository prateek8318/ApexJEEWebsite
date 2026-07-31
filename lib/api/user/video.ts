import { userClient } from "./client";
import { ApiResponse, Video } from "../../../types/user-api";

export const userVideoApi = {
  getVideosByTopic: async (topicId: string, search?: string): Promise<ApiResponse<Video[]>> => {
    const params = new URLSearchParams();
    params.append("topic", topicId);
    if (search) params.append("search", search);
    
    const response = await userClient.get(`/videos?${params.toString()}`);
    return response.data;
  },
  
  getVideoById: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await userClient.get(`/videos/${id}`);
    return response.data;
  }
};
