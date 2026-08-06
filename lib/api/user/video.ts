import { userClient } from "./client";
import { ApiResponse, Video } from "../../../types/user-api";

export const userVideoApi = {
  getVideosByTopic: async (
    topicId: string,
    params?: {
      search?: string;
      difficulty?: string;
      videoCategory?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<Video[]>> => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.difficulty) query.append("difficulty", params.difficulty);
    if (params?.videoCategory) query.append("videoCategory", params.videoCategory);
    if (params?.page !== undefined) query.append("page", String(params.page));
    if (params?.limit !== undefined) query.append("limit", String(params.limit));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const response = await userClient.get(`/topicsVideos/${topicId}${queryString}`);
    return response.data;
  },
  
  getVideoById: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await userClient.get(`/videos/${id}`);
    return response.data;
  },

  markVideoWatched: async (id: string): Promise<ApiResponse<any>> => {
    const response = await userClient.patch(`/videos/${id}/mark-watched`);
    return response.data;
  },

  updateWatchProgress: async (id: string, watchedDurationSec: number): Promise<ApiResponse<any>> => {
    const response = await userClient.patch(`/videos/${id}/progress`, { watchedDurationSec });
    return response.data;
  },

  incrementWatchCount: async (id: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/videos/${id}/watch`);
    return response.data;
  },

  toggleFavourite: async (id: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/videos/${id}/favourite/toggle`);
    return response.data;
  },

  flagVideo: async (id: string, notes?: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/videos/${id}/flag`, { notes });
    return response.data;
  },

  unflagVideo: async (id: string): Promise<ApiResponse<any>> => {
    const response = await userClient.delete(`/videos/${id}/flag`);
    return response.data;
  }
};
