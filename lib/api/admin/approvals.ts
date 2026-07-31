import { adminClient } from './client';

export const approvalApi = {
  getPendingAdmins: (params?: { page?: number; limit?: number; search?: string; approvalStatus?: string }) => 
    adminClient.get('/pendingAdmin', { params }),

  approveAdmin: (id: string) => 
    adminClient.patch(`/${id}/approve`),

  rejectAdmin: (id: string, reason: string) => 
    adminClient.patch(`/${id}/reject`, { reason }),
};
