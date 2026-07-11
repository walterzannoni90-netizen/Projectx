import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuantizationService } from './quantization.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Quantization')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('quantization')
export class QuantizationController {
  constructor(private readonly quantizationService: QuantizationService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start quantization' })
  async start(@CurrentUser('id') userId: string) {
    return this.quantizationService.startQuantization(userId);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get quantization status' })
  async getStatus(@CurrentUser('id') userId: string) {
    return this.quantizationService.getStatus(userId);
  }
}
