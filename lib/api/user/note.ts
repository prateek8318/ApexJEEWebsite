import { userClient } from "./client";
import { ApiResponse, Note } from "../../../types/user-api";

export const userNoteApi = {
  getNotesByTopic: async (topicId: string, search?: string): Promise<ApiResponse<Note[]>> => {
    const params = new URLSearchParams();
    params.append("topic", topicId);
    if (search) params.append("search", search);
    
    const response = await userClient.get(`/notes?${params.toString()}`);
    return response.data;
  },
  
  getNoteById: async (id: string): Promise<ApiResponse<Note>> => {
    const response = await userClient.get(`/notes/${id}`);
    return response.data;
  }
};
