import { adminClient } from './client';
import { Test, ApiResponse } from '../../../types/admin-api';

export const testsApi = {
  createTest: async (data: Partial<Test>): Promise<ApiResponse<Test>> => {
    const response = await adminClient.post('/tests', data);
    return response.data;
  },

  getAllTests: async (params?: Record<string, any>): Promise<ApiResponse<Test[]>> => {
    const response = await adminClient.get('/tests', { params });
    return response.data;
  },

  getTest: async (id: string): Promise<ApiResponse<Test>> => {
    const response = await adminClient.get(`/tests/${id}`);
    return response.data;
  },

  updateTest: async (id: string, data: Partial<Test>): Promise<ApiResponse<Test>> => {
    const response = await adminClient.patch(`/tests/${id}`, data);
    return response.data;
  },

  deleteTest: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/tests/${id}`);
    return response.data;
  },

  addQuestions: async (id: string, questionsData: any): Promise<ApiResponse<Test>> => {
    const response = await adminClient.post(`/tests/${id}/questions`, questionsData);
    return response.data;
  },

  removeQuestion: async (id: string, questionId: string): Promise<ApiResponse<Test>> => {
    const response = await adminClient.delete(`/tests/${id}/questions`, {
      data: { questionId }
    });
    return response.data;
  },

  uploadWordQuestions: async (formData: FormData): Promise<ApiResponse<Test>> => {
    // Note: formData should contain 'testId' and 'wordFile'
    const response = await adminClient.post('/uploadQuestionsWithTest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
