import { userClient } from "./client";
import { ApiResponse, TestAttempt } from "../../../types/user-api";

export const userTestAttemptApi = {
  startPracticeAttempt: async (testId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.post("/practice-attempts/start", { testId });
    return response.data;
  },

  savePracticeAnswer: async (
    attemptId: string,
    questionId: string,
    data: {
      action?: "answer" | "skip" | "know_and_skip" | "mark_review" | "clear";
      selectedOptions?: number[];
      integerAnswerGiven?: string | number | null;
      timeSpent?: number;
      markedForReview?: boolean;
    }
  ): Promise<ApiResponse<any>> => {
    const response = await userClient.patch(`/practice-attempts/${attemptId}/questions/${questionId}`, data);
    return response.data;
  },

  getPracticeSession: async (attemptId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/practice-attempts/${attemptId}/session`);
    return response.data;
  },

  submitPracticeAttempt: async (
    attemptId: string,
    data?: { autoSubmit?: boolean }
  ): Promise<ApiResponse<TestAttempt>> => {
    const response = await userClient.post(`/practice-attempts/${attemptId}/submit`, data || {});
    return response.data;
  },

  getPracticeAttemptReview: async (attemptId: string): Promise<ApiResponse<any>> => {
    const response = await userClient.get(`/practice-attempts/${attemptId}/review`);
    return response.data;
  },

  getPracticePerformance: async (): Promise<ApiResponse<any>> => {
    const response = await userClient.get("/performance/practice");
    return response.data;
  },
};
