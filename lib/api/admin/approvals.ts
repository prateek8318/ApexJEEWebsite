import { adminClient } from './client';

export const approvalApi = {
  getPendingAdmins: async (params?: { page?: number; limit?: number; search?: string; approvalStatus?: string }) => {
    const response = await adminClient.get('/pendingAdmin', { params });
    return response.data;
  },

  approveAdmin: async (id: string) => {
    const response = await adminClient.patch(`/${id}/approve`);
    return response.data;
  },

  rejectAdmin: async (id: string, reason: string) => {
    const response = await adminClient.patch(`/${id}/reject`, { reason });
    return response.data;
  },
};
