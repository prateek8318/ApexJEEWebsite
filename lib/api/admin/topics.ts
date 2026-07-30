import { adminClient } from './client';
import { Topic, ApiResponse } from '../../../types/admin-api';

export const topicsApi = {
  createTopic: async (data: Partial<Topic>): Promise<ApiResponse<Topic>> => {
    const response = await adminClient.post('/topics', data);
    return response.data;
  },

  getAllTopics: async (params?: Record<string, any>): Promise<ApiResponse<Topic[]>> => {
    const response = await adminClient.get('/topics', { params });
    return response.data;
  },

  getTopic: async (id: string): Promise<ApiResponse<Topic>> => {
    const response = await adminClient.get(`/topics/${id}`);
    return response.data;
  },

  updateTopic: async (id: string, data: Partial<Topic>): Promise<ApiResponse<Topic>> => {
    const response = await adminClient.patch(`/topics/${id}`, data);
    return response.data;
  },

  deleteTopic: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/topics/${id}`);
    return response.data;
  },
};
