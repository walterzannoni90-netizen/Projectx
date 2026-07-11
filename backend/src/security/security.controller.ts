import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Security')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('info')
  @ApiOperation({ summary: 'Get security info' })
  async getSecurityInfo() {
    return this.securityService.getSecurityInfo();
  }
}
