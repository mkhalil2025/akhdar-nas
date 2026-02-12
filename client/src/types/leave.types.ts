// Leave Management Type Definitions

export enum LeaveStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface LeaveType {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeaveRequest {
    id: string;
    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    approver?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    leaveType: {
        id: string;
        name: string;
    };
    startDate: string;
    endDate: string;
    reason: string;
    status: LeaveStatus;
    workingDays: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface LeaveBalance {
    id: string;
    userId: string;
    leaveTypeId: string;
    year: number;
    totalDays: number;
    usedDays: number;
    leaveType: {
        id: string;
        name: string;
    };
}

export interface CreateLeaveRequestDto {
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface ApproveRejectLeaveDto {
    comment?: string;
}
