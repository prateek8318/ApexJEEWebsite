import { adminClient } from './client';
import { Note, ApiResponse } from '../../../types/admin-api';

export const notesApi = {
  createNote: async (formData: FormData): Promise<ApiResponse<Note>> => {
    const response = await adminClient.post('/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAllNotes: async (params?: Record<string, any>): Promise<ApiResponse<Note[]>> => {
    const response = await adminClient.get('/notes', { params });
    return response.data;
  },

  getNote: async (id: string): Promise<ApiResponse<Note>> => {
    const response = await adminClient.get(`/notes/${id}`);
    return response.data;
  },

  updateNote: async (id: string, formData: FormData): Promise<ApiResponse<Note>> => {
    const response = await adminClient.patch(`/notes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteNote: async (id: string): Promise<ApiResponse> => {
    const response = await adminClient.delete(`/notes/${id}`);
    return response.data;
  },
};
