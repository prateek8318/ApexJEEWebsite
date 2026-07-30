import { adminClient } from './client';
import { Chapter, ApiResponse } from '../../../types/admin-api';

export const chaptersApi = {
  createChapter: async (data: Partial<Chapter>): Promise<ApiResponse<Chapter>> => {
    const response = await adminClient.post('/chapters', data);
    return response.data;
  },

  getAllChapters: async (params?: Record<string, any>): Promise<ApiResponse<Chapter[]>> => {
    const response = await adminClient.get('/chapters', { params });
    return response.data;
  },

  getChapter: async (id: string): Promise<ApiResponse<Chapter>> => {
    const response = await adminClient.get(`/chapters/${id}`);
    return response.data;
  },

  updateChapter: async (id: string, data: Partial<Chapter>): Promise<ApiResponse<Chapter>> => {
    const response = await adminClient.patch(`/chapters/${id}`, data);
    return response.data;
  },

  deleteChapter: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/chapters/${id}`);
    return response.data;
  },
};
