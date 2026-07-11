import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DepositsService } from './deposits.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Deposits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user deposits' })
  async getUserDeposits(@CurrentUser('id') userId: string) {
    return this.depositsService.getUserDeposits(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create deposit' })
  async createDeposit(
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.depositsService.create({ ...data, userId });
  }
}
