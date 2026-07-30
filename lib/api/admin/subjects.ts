import { adminClient } from './client';
import { Subject, ApiResponse } from '../../../types/admin-api';

export const subjectsApi = {
  createSubject: async (formData: FormData): Promise<ApiResponse<Subject>> => {
    const response = await adminClient.post('/subjects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllSubjects: async (search?: string): Promise<ApiResponse<Subject[]>> => {
    const params = search ? { search } : {};
    const response = await adminClient.get('/subjects', { params });
    return response.data;
  },

  getSubject: async (id: string): Promise<ApiResponse<Subject>> => {
    const response = await adminClient.get(`/subjects/${id}`);
    return response.data;
  },

  updateSubject: async (id: string, formData: FormData): Promise<ApiResponse<Subject>> => {
    const response = await adminClient.patch(`/subjects/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteSubject: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/subjects/${id}`);
    return response.data;
  },
};
