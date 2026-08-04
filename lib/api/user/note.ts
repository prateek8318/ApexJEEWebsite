import { userClient } from "./client";
import { ApiResponse, Note } from "../../../types/user-api";

export const userNoteApi = {
  getNotesByTopic: async (topicId: string, search?: string): Promise<ApiResponse<Note[]>> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    const queryString = params.toString() ? `?${params.toString()}` : "";
    
    const response = await userClient.get(`/topics/${topicId}/notes${queryString}`);
    return response.data;
  },
  
  getNoteById: async (id: string): Promise<ApiResponse<Note>> => {
    const response = await userClient.get(`/notes/${id}`);
    return response.data;
  },

  toggleFavourite: async (noteId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/notes/${noteId}/favourite/toggle`);
    return response.data;
  }
};
