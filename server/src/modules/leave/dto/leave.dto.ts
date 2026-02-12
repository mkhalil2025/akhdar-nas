import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLeaveRequestDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty()
    @IsString()
    leaveTypeId: string;

    @ApiProperty({ example: '2026-03-01T00:00:00Z' })
    @IsNotEmpty()
    @IsDateString()
    startDate: string;

    @ApiProperty({ example: '2026-03-05T00:00:00Z' })
    @IsNotEmpty()
    @IsDateString()
    endDate: string;

    @ApiProperty({ example: 'Family vacation' })
    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class ApproveRejectLeaveDto {
    @ApiProperty({ example: 'Approved for this period', required: false })
    @IsString()
    comment?: string;
}

export class LeaveRequestResponseDto {
    id: string;
    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    leaveType: {
        id: string;
        name: string;
    };
    startDate: Date;
    endDate: Date;
    reason: string;
    status: string;
    workingDays: number | null;
    createdAt: Date;
    approver?: {
        id: string;
        firstName: string;
        lastName: string;
    };
}
