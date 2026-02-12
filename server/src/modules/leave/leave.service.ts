import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeaveRequestDto, LeaveRequestResponseDto } from './dto/leave.dto';
import { LeaveStatus } from '@prisma/client';

@Injectable()
export class LeaveService {
    constructor(private prisma: PrismaService) { }

    /**
     * Calculate working days between two dates, excluding weekends and holidays
     */
    async calculateWorkingDays(startDate: Date, endDate: Date): Promise<number> {
        const holidays = await this.prisma.holiday.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const holidayDates = new Set(holidays.map(h => h.date.toISOString().split('T')[0]));
        let workingDays = 0;
        const current = new Date(startDate);

        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            const dateStr = current.toISOString().split('T')[0];

            // Skip weekends (0 = Sunday, 6 = Saturday) and holidays
            if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayDates.has(dateStr)) {
                workingDays++;
            }

            current.setDate(current.getDate() + 1);
        }

        return workingDays;
    }

    /**
     * Check if user has overlapping leave requests
     */
    async checkOverlap(userId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<boolean> {
        const overlapping = await this.prisma.leaveRequest.findFirst({
            where: {
                applicantId: userId,
                id: excludeId ? { not: excludeId } : undefined,
                status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
                OR: [
                    {
                        startDate: { lte: endDate },
                        endDate: { gte: startDate },
                    },
                ],
            },
        });

        return !!overlapping;
    }

    /**
     * Create a new leave request
     */
    async createLeaveRequest(userId: string, dto: CreateLeaveRequestDto): Promise<LeaveRequestResponseDto> {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);

        // Validation
        if (startDate > endDate) {
            throw new BadRequestException('Start date must be before or equal to end date');
        }

        // Check for overlapping requests
        const hasOverlap = await this.checkOverlap(userId, startDate, endDate);
        if (hasOverlap) {
            throw new BadRequestException('You have an overlapping leave request for this period');
        }

        // Calculate working days
        const workingDays = await this.calculateWorkingDays(startDate, endDate);

        if (workingDays === 0) {
            throw new BadRequestException('Leave request must include at least one working day');
        }

        // Get user's manager
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { managerId: true },
        });

        // Create leave request
        const leaveRequest = await this.prisma.leaveRequest.create({
            data: {
                applicantId: userId,
                leaveTypeId: dto.leaveTypeId,
                startDate,
                endDate,
                reason: dto.reason,
                workingDays,
                status: LeaveStatus.PENDING,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                leaveType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // TODO: Create notification for manager
        // if (user?.managerId) {
        //   await this.notificationService.createNotification({
        //     title: 'New Leave Request',
        //     message: `${leaveRequest.applicant.firstName} ${leaveRequest.applicant.lastName} requested leave`,
        //     type: 'LEAVE_UPDATE',
        //     recipientIds: [user.managerId],
        //   });
        // }

        return leaveRequest;
    }

    /**
     * Get user's leave requests
     */
    async getMyLeaveRequests(userId: string, status?: LeaveStatus): Promise<LeaveRequestResponseDto[]> {
        return this.prisma.leaveRequest.findMany({
            where: {
                applicantId: userId,
                status: status ? status : undefined,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                leaveType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Get pending leave requests for manager
     */
    async getPendingApprovals(managerId: string): Promise<LeaveRequestResponseDto[]> {
        // Get subordinates
        const subordinates = await this.prisma.user.findMany({
            where: { managerId },
            select: { id: true },
        });

        const subordinateIds = subordinates.map(s => s.id);

        return this.prisma.leaveRequest.findMany({
            where: {
                applicantId: { in: subordinateIds },
                status: LeaveStatus.PENDING,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                leaveType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    /**
     * Approve leave request
     */
    async approveLeaveRequest(leaveId: string, managerId: string, comment?: string): Promise<LeaveRequestResponseDto> {
        const leaveRequest = await this.prisma.leaveRequest.findUnique({
            where: { id: leaveId },
            include: { applicant: true },
        });

        if (!leaveRequest) {
            throw new NotFoundException('Leave request not found');
        }

        if (leaveRequest.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('Leave request is not pending');
        }

        // Verify manager authority
        if (leaveRequest.applicant.managerId !== managerId) {
            throw new ForbiddenException('You are not authorized to approve this leave request');
        }

        // Update leave request
        const updated = await this.prisma.leaveRequest.update({
            where: { id: leaveId },
            data: {
                status: LeaveStatus.APPROVED,
                approverId: managerId,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                leaveType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // TODO: Update leave balance
        // TODO: Send notification to employee

        return updated;
    }

    /**
     * Reject leave request
     */
    async rejectLeaveRequest(leaveId: string, managerId: string, reason?: string): Promise<LeaveRequestResponseDto> {
        const leaveRequest = await this.prisma.leaveRequest.findUnique({
            where: { id: leaveId },
            include: { applicant: true },
        });

        if (!leaveRequest) {
            throw new NotFoundException('Leave request not found');
        }

        if (leaveRequest.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('Leave request is not pending');
        }

        // Verify manager authority
        if (leaveRequest.applicant.managerId !== managerId) {
            throw new ForbiddenException('You are not authorized to reject this leave request');
        }

        // Update leave request
        const updated = await this.prisma.leaveRequest.update({
            where: { id: leaveId },
            data: {
                status: LeaveStatus.REJECTED,
                approverId: managerId,
            },
            include: {
                applicant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                leaveType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                approver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // TODO: Send notification to employee with rejection reason

        return updated;
    }

    /**
     * Cancel leave request (employee only, pending only)
     */
    async cancelLeaveRequest(leaveId: string, userId: string): Promise<void> {
        const leaveRequest = await this.prisma.leaveRequest.findUnique({
            where: { id: leaveId },
        });

        if (!leaveRequest) {
            throw new NotFoundException('Leave request not found');
        }

        if (leaveRequest.applicantId !== userId) {
            throw new ForbiddenException('You can only cancel your own leave requests');
        }

        if (leaveRequest.status !== LeaveStatus.PENDING) {
            throw new BadRequestException('You can only cancel pending leave requests');
        }

        await this.prisma.leaveRequest.delete({
            where: { id: leaveId },
        });
    }

    /**
     * Get leave types
     */
    async getLeaveTypes() {
        return this.prisma.leaveType.findMany({
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Get leave balance for user
     */
    async getLeaveBalance(userId: string, year: number = new Date().getFullYear()) {
        const balances = await this.prisma.leaveBalance.findMany({
            where: { userId, year },
            include: {
                leaveType: true,
            },
        });

        return balances.map(b => ({
            leaveType: b.leaveType.name,
            totalDays: b.totalDays,
            usedDays: b.usedDays,
            availableDays: b.totalDays - b.usedDays,
        }));
    }
}
