import { adminClient } from './client';
import { AdminProfile, ApiResponse } from '../../../types/admin-api';

export const authApi = {
  /**
   * Register a new admin.
   * Note: The backend expects `profileImage` which should be sent as FormData.
   */
  register: async (formData: FormData): Promise<ApiResponse> => {
    const response = await adminClient.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Login admin.
   */
  login: async (credentials: { email: string; password?: string; [key: string]: any }): Promise<ApiResponse> => {
    const payload = {
      ...credentials,
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password ? String(credentials.password) : undefined
    };
    const response = await adminClient.post('/login', payload);
    return response.data;
  },

  /**
   * Get current admin profile.
   */
  getProfile: async (): Promise<ApiResponse<AdminProfile>> => {
    const response = await adminClient.get('/profile');
    return response.data;
  },

  /**
   * Verify OTP
   */
  verifyOtp: async (data: { identifier: string; otp: string }): Promise<ApiResponse> => {
    const response = await adminClient.post('/verify-otp', data);
    return response.data;
  },

  /**
   * Resend OTP
   */
  resendOtp: async (data: { identifier: string }): Promise<ApiResponse> => {
    const response = await adminClient.post('/resend-otp', data);
    return response.data;
  },
};