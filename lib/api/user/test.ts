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
  }
};
