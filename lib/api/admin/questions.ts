import { adminClient } from './client';
import { Question, ApiResponse } from '../../../types/admin-api';

export const questionsApi = {
  createQuestion: async (formData: FormData): Promise<ApiResponse<Question>> => {
    const response = await adminClient.post('/questions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllQuestions: async (params?: Record<string, any>): Promise<ApiResponse<Question[]>> => {
    const response = await adminClient.get('/questions', { params });
    return response.data;
  },

  getQuestion: async (id: string): Promise<ApiResponse<Question>> => {
    const response = await adminClient.get(`/questions/${id}`);
    return response.data;
  },

  updateQuestion: async (id: string, formData: FormData): Promise<ApiResponse<Question>> => {
    const response = await adminClient.patch(`/questions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/questions/${id}`);
    return response.data;
  },

  uploadQuestionsToCDN: async (formData: FormData): Promise<ApiResponse> => {
    const response = await adminClient.post('/uploadQuestions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
