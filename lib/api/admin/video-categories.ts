import { adminClient } from './client';
import { ApiResponse, VideoCategory } from '../../../types/admin-api';

export const videoCategoriesApi = {
  createVideoCategory: async (data: Partial<VideoCategory>): Promise<ApiResponse<VideoCategory>> => {
    const response = await adminClient.post('/video-categories', data);
    return response.data;
  },

  getAllVideoCategories: async (params?: Record<string, any>): Promise<ApiResponse<VideoCategory[]>> => {
    const response = await adminClient.get('/video-categories', { params });
    return response.data;
  },

  getVideoCategory: async (id: string): Promise<ApiResponse<VideoCategory>> => {
    const response = await adminClient.get(`/video-categories/${id}`);
    return response.data;
  },

  updateVideoCategory: async (id: string, data: Partial<VideoCategory>): Promise<ApiResponse<VideoCategory>> => {
    const response = await adminClient.patch(`/video-categories/${id}`, data);
    return response.data;
  },

  deleteVideoCategory: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/video-categories/${id}`);
    return response.data;
  },
};
