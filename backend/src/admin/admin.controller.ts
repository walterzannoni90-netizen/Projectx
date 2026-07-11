import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({ summary: 'List users' })
  async getUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(page, limit, search);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user detail' })
  async getUserDetail(@Param('id') id: string) {
    return this.adminService.getUserDetail(id);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('withdrawals/pending')
  @ApiOperation({ summary: 'Get pending withdrawals' })
  async getPendingWithdrawals() {
    return this.adminService.getPendingWithdrawals();
  }

  @Post('withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal' })
  async approveWithdrawal(
    @Param('id') id: string,
    @Body('adminId') adminId: string,
  ) {
    return this.adminService.approveWithdrawal(id, adminId);
  }

  @Post('withdrawals/:id/complete')
  @ApiOperation({ summary: 'Complete withdrawal with tx hash' })
  async completeWithdrawal(
    @Param('id') id: string,
    @Body('txHash') txHash: string,
  ) {
    return this.adminService.completeWithdrawal(id, txHash);
  }

  @Post('withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal' })
  async rejectWithdrawal(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.adminService.rejectWithdrawal(id, reason);
  }

  @Get('stats')
  @ApiOperation({ summary: 'System statistics' })
  async getStats() {
    return this.adminService.getSystemStats();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  async getAuditLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAuditLogs(page, limit);
  }
}
