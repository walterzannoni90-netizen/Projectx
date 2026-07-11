import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.usersService.updateProfile(userId, data);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get active sessions' })
  async getSessions(@CurrentUser('id') userId: string) {
    return this.usersService.getSessions(userId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get user dashboard' })
  async getDashboard(@CurrentUser('id') userId: string) {
    return this.usersService.getDashboard(userId);
  }
}
