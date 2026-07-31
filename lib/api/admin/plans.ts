import { adminClient } from './client';
import { SubscriptionPlan, ApiResponse } from '../../../types/admin-api';

export const plansApi = {
  createPlan: async (data: any): Promise<ApiResponse<SubscriptionPlan>> => {
    const response = await adminClient.post('/plans', data);
    return response.data;
  },

  getAllPlans: async (search?: string, planType?: string): Promise<ApiResponse<SubscriptionPlan[]>> => {
    const params: any = {};
    if (search) params.search = search;
    if (planType) params.planType = planType;
    const response = await adminClient.get('/plans', { params });
    return response.data;
  },

  getPlan: async (id: string): Promise<ApiResponse<SubscriptionPlan>> => {
    const response = await adminClient.get(`/plans/${id}`);
    return response.data;
  },

  updatePlan: async (id: string, data: any): Promise<ApiResponse<SubscriptionPlan>> => {
    const response = await adminClient.patch(`/plans/${id}`, data);
    return response.data;
  },

  deletePlan: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/plans/${id}`);
    return response.data;
  },
};
