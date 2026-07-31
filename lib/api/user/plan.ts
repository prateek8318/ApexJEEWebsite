import { userClient } from './client';
import { ApiResponse } from '@/types/admin-api';

export const planApi = {
  getAllPlans: async (): Promise<ApiResponse> => {
    const response = await userClient.get('/plans');
    return response.data;
  },
  getPlan: async (id: string): Promise<ApiResponse> => {
    const response = await userClient.get(`/plans/${id}`);
    return response.data;
  }
};
