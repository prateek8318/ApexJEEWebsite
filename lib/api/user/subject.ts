import { userClient } from "./client";
import { ApiResponse, Subject, Chapter } from "../../../types/user-api";

export const userSubjectApi = {
  getAllSubjects: async (search?: string): Promise<ApiResponse<Subject[]>> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    
    const response = await userClient.get(`/subjects?${params.toString()}`);
    return response.data;
  },

  getSubjectById: async (id: string): Promise<ApiResponse<Subject>> => {
    const response = await userClient.get(`/subjects/${id}`);
    return response.data;
  },

  getChaptersBySubject: async (subjectId: string, search?: string): Promise<ApiResponse<Chapter[]>> => {
    const params = new URLSearchParams();
    params.append("subject", subjectId);
    if (search) params.append("search", search);
    
    const response = await userClient.get(`/chapters?${params.toString()}`);
    return response.data;
  }
};
