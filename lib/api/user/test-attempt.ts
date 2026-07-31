import { userClient } from "./client";
import { ApiResponse, TestAttempt } from "../../../types/user-api";

export const userTestAttemptApi = {
  startTestAttempt: async (testId: string): Promise<ApiResponse<TestAttempt>> => {
    const response = await userClient.get(`/startTest/${testId}`);
    return response.data;
  },

  submitTestAttempt: async (
    attemptId: string, 
    data: { 
      responses: any[]; 
      autoSubmitted?: boolean;
    }
  ): Promise<ApiResponse<TestAttempt>> => {
    const response = await userClient.post(`/submitTest/${attemptId}`, data);
    return response.data;
  }
};
