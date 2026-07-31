import { adminClient } from './client';
import { ApiResponse, User } from '@/types/admin-api';

export const userApi = {
  getAllUsers: async (params?: Record<string, any>): Promise<ApiResponse<User[]>> => {
    const response = await adminClient.get('/users', { params });
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await adminClient.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await adminClient.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await adminClient.patch(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/users/${id}`);
    return response.data;
  },
  
  restoreUser: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.patch(`/users/${id}/restore`);
    return response.data;
  }
};
