import { adminClient } from './client';
import { Video, ApiResponse } from '../../../types/admin-api';

export const videosApi = {
  createVideo: async (data: Partial<Video>): Promise<ApiResponse<Video>> => {
    const response = await adminClient.post('/video', data);
    return response.data;
  },

  getAllVideos: async (params?: Record<string, any>): Promise<ApiResponse<Video[]>> => {
    const response = await adminClient.get('/video', { params });
    return response.data;
  },

  getVideo: async (id: string): Promise<ApiResponse<Video>> => {
    const response = await adminClient.get(`/video/${id}`);
    return response.data;
  },

  updateVideo: async (id: string, data: Partial<Video>): Promise<ApiResponse<Video>> => {
    const response = await adminClient.patch(`/video/${id}`, data);
    return response.data;
  },

  deleteVideo: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/video/${id}`);
    return response.data;
  },
};
