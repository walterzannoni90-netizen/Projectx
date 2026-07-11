import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Withdrawals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user withdrawals' })
  async getUserWithdrawals(@CurrentUser('id') userId: string) {
    return this.withdrawalsService.getUserWithdrawals(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Request withdrawal' })
  async requestWithdrawal(
    @CurrentUser('id') userId: string,
    @Body() data: { amount: number; chain: string; toAddress: string; pin: string },
  ) {
    return this.withdrawalsService.request(userId, data);
  }
}
