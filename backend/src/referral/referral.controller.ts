import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Referral')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('team')
  @ApiOperation({ summary: 'Get referral team' })
  async getTeam(@CurrentUser('id') userId: string) {
    return this.referralService.getTeam(userId);
  }

  @Get('rewards')
  @ApiOperation({ summary: 'Get referral rewards' })
  async getRewards(@CurrentUser('id') userId: string) {
    return this.referralService.getRewards(userId);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get referral tree' })
  async getTree(@CurrentUser('id') userId: string) {
    return this.referralService.getReferralTree(userId);
  }
}
