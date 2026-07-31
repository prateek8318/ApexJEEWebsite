import { userClient } from "./client";
import { ApiResponse, Chapter } from "../../../types/user-api";

export const userChapterApi = {
  getChapterById: async (id: string): Promise<ApiResponse<Chapter>> => {
    const response = await userClient.get(`/chapters/${id}`);
    return response.data;
  }
};
