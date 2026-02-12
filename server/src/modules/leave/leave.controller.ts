import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaveService } from './leave.service';
import { CreateLeaveRequestDto, ApproveRejectLeaveDto } from './dto/leave.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, LeaveStatus } from '@prisma/client';

@ApiTags('Leave Management')
@ApiBearerAuth()
@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
    constructor(private leaveService: LeaveService) { }

    @Post('request')
    @ApiOperation({ summary: 'Create a leave request' })
    async createLeaveRequest(
        @CurrentUser() user: any,
        @Body() dto: CreateLeaveRequestDto,
    ) {
        return this.leaveService.createLeaveRequest(user.userId, dto);
    }

    @Get('my-requests')
    @ApiOperation({ summary: 'Get my leave requests' })
    async getMyLeaveRequests(
        @CurrentUser() user: any,
        @Query('status') status?: LeaveStatus,
    ) {
        return this.leaveService.getMyLeaveRequests(user.userId, status);
    }

    @Get('pending-approvals')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Get pending leave approvals (Manager/Admin only)' })
    async getPendingApprovals(@CurrentUser() user: any) {
        return this.leaveService.getPendingApprovals(user.userId);
    }

    @Put(':id/approve')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Approve a leave request' })
    async approveLeaveRequest(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: ApproveRejectLeaveDto,
    ) {
        return this.leaveService.approveLeaveRequest(id, user.userId, dto.comment);
    }

    @Put(':id/reject')
    @Roles(Role.MANAGER, Role.ADMIN)
    @ApiOperation({ summary: 'Reject a leave request' })
    async rejectLeaveRequest(
        @Param('id') id: string,
        @CurrentUser() user: any,
        @Body() dto: ApproveRejectLeaveDto,
    ) {
        return this.leaveService.rejectLeaveRequest(id, user.userId, dto.comment);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Cancel a leave request (only pending)' })
    async cancelLeaveRequest(@Param('id') id: string, @CurrentUser() user: any) {
        await this.leaveService.cancelLeaveRequest(id, user.userId);
        return { message: 'Leave request cancelled successfully' };
    }

    @Get('types')
    @ApiOperation({ summary: 'Get all leave types' })
    async getLeaveTypes() {
        return this.leaveService.getLeaveTypes();
    }

    @Get('balance')
    @ApiOperation({ summary: 'Get my leave balance' })
    async getLeaveBalance(@CurrentUser() user: any, @Query('year') year?: number) {
        return this.leaveService.getLeaveBalance(
            user.userId,
            year ? parseInt(year.toString()) : undefined,
        );
    }
}
