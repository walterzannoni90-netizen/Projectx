import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LevelsService } from './levels.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Levels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all levels' })
  async getAll() {
    return this.levelsService.getAllLevels();
  }

  @Get('my-level')
  @ApiOperation({ summary: 'Get current user level' })
  async getMyLevel(@CurrentUser('id') userId: string) {
    return this.levelsService.getUserLevel(userId);
  }

  @Get('check-upgrade')
  @ApiOperation({ summary: 'Check if upgrade is available' })
  async checkUpgrade(@CurrentUser('id') userId: string) {
    return this.levelsService.checkUpgrade(userId);
  }

  @Post('upgrade')
  @ApiOperation({ summary: 'Perform level upgrade' })
  async upgrade(@CurrentUser('id') userId: string) {
    return this.levelsService.performUpgrade(userId);
  }
}
