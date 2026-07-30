import { userClient } from './client';
import { ApiResponse } from '../../../types/admin-api';

export const userAuthApi = {
  signUp: async (data: any): Promise<ApiResponse<any>> => {
    const response = await userClient.post('/signUp', data);
    return response.data;
  },
  verifyOtp: async (data: any): Promise<ApiResponse<any>> => {
    const response = await userClient.post('/verifyOtp', data);
    return response.data;
  },
  login: async (data: any): Promise<ApiResponse<any>> => {
    const response = await userClient.post('/login', data);
    return response.data;
  }
};
