import { userClient } from './client';
import { ApiResponse, UserProfile } from '../../../types/user-api';

export const userProfileApi = {
  getProfile: async (): Promise<ApiResponse<UserProfile>> => {
    const response = await userClient.get('/profile');
    return response.data;
  },

  updateProfile: async (formData: FormData): Promise<ApiResponse<UserProfile>> => {
    const response = await userClient.patch('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
