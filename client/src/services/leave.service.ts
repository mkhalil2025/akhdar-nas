import apiClient from './api';
import {
    LeaveType,
    LeaveRequest,
    LeaveBalance,
    CreateLeaveRequestDto,
    ApproveRejectLeaveDto,
    LeaveStatus,
} from '../types/leave.types';

export const leaveService = {
    // Get all available leave types
    async getLeaveTypes(): Promise<LeaveType[]> {
        const response = await apiClient.get<LeaveType[]>('/leave/types');
        return response.data;
    },

    // Create a new leave request
    async createLeaveRequest(data: CreateLeaveRequestDto): Promise<LeaveRequest> {
        const response = await apiClient.post<LeaveRequest>('/leave/request', data);
        return response.data;
    },

    // Get current user's leave requests with optional status filter
    async getMyLeaveRequests(status?: LeaveStatus): Promise<LeaveRequest[]> {
        const params = status ? { status } : {};
        const response = await apiClient.get<LeaveRequest[]>('/leave/my-requests', { params });
        return response.data;
    },

    // Cancel a pending leave request
    async cancelLeaveRequest(id: string): Promise<void> {
        await apiClient.delete(`/leave/${id}`);
    },

    // Get current user's leave balance
    async getLeaveBalance(year?: number): Promise<LeaveBalance[]> {
        const params = year ? { year } : {};
        const response = await apiClient.get<LeaveBalance[]>('/leave/balance', { params });
        return response.data;
    },

    // Get pending leave approvals (Manager/Admin only)
    async getPendingApprovals(): Promise<LeaveRequest[]> {
        const response = await apiClient.get<LeaveRequest[]>('/leave/pending-approvals');
        return response.data;
    },

    // Approve a leave request (Manager/Admin only)
    async approveLeaveRequest(id: string, comment?: string): Promise<LeaveRequest> {
        const data: ApproveRejectLeaveDto = comment ? { comment } : {};
        const response = await apiClient.put<LeaveRequest>(`/leave/${id}/approve`, data);
        return response.data;
    },

    // Reject a leave request (Manager/Admin only)
    async rejectLeaveRequest(id: string, comment?: string): Promise<LeaveRequest> {
        const data: ApproveRejectLeaveDto = comment ? { comment } : {};
        const response = await apiClient.put<LeaveRequest>(`/leave/${id}/reject`, data);
        return response.data;
    },
};
