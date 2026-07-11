import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@CurrentUser('id') userId: string) {
    return this.walletsService.getBalance(userId);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactions(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
  ) {
    return this.walletsService.getTransactions(userId, page, limit, { type });
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get deposit addresses' })
  async getAddresses(@CurrentUser('id') userId: string) {
    return this.walletsService.getAddresses(userId);
  }

  @Post('addresses/:chain')
  @ApiOperation({ summary: 'Generate deposit address for chain' })
  async generateAddress(
    @CurrentUser('id') userId: string,
    @Param('chain') chain: any,
  ) {
    return this.walletsService.generateAddress(userId, chain);
  }
}
