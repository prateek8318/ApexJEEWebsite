import { userClient } from "./client";
import { ApiResponse, Test } from "../../../types/user-api";

export const userTestApi = {
  getAllTests: async (
    params?: { search?: string; mode?: string; testCategory?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<Test[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.mode) searchParams.append("mode", params.mode);
    if (params?.testCategory) searchParams.append("testCategory", params.testCategory);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    
    const response = await userClient.get(`/tests?${searchParams.toString()}`);
    return response.data;
  },
  
  getTestById: async (id: string): Promise<ApiResponse<Test>> => {
    const response = await userClient.get(`/tests/${id}`);
    return response.data;
  },

  getPracticeTestsByTopic: async (topicId: string): Promise<ApiResponse<Test[]>> => {
    const response = await userClient.get(`/topics/${topicId}/practice-tests`);
    return response.data;
  },

  getPracticeTestDetail: async (testId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/practice-tests/${testId}`);
    return response.data;
  },

  getPracticeTestQuestions: async (testId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/practice-tests/${testId}/questions`);
    return response.data;
  },

  startTestAttempt: async (testId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/startTest/${testId}`);
    return response.data;
  },

  submitTestAttempt: async (attemptId: string, data: any): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/submitTest/${attemptId}`, data);
    return response.data;
  },

  toggleFavourite: async (testId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post(`/practice-tests/${testId}/favourite/toggle`);
    return response.data;
  }
};
