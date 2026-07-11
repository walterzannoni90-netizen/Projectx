import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SetPinDto, ChangePinDto, VerifyPinDto } from './dto/pin.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  async logout(
    @CurrentUser('id') userId: string,
    @Body('refreshToken') refreshToken?: string,
  ) {
    return this.authService.logout(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAll(@CurrentUser('id') userId: string) {
    return this.authService.logoutAllDevices(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(userId, dto.currentPassword, dto.newPassword);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/setup')
  @ApiOperation({ summary: 'Setup 2FA' })
  async setup2FA(@CurrentUser('id') userId: string) {
    return this.authService.setup2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify and enable 2FA' })
  async verify2FA(
    @CurrentUser('id') userId: string,
    @Body('token') token: string,
  ) {
    return this.authService.verify2FA(userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Disable 2FA' })
  async disable2FA(
    @CurrentUser('id') userId: string,
    @Body('token') token: string,
  ) {
    return this.authService.disable2FA(userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('pin/set')
  @ApiOperation({ summary: 'Set wallet PIN' })
  async setPin(
    @CurrentUser('id') userId: string,
    @Body() dto: SetPinDto,
  ) {
    return this.authService.setPin(userId, dto.pin);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('pin/change')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change wallet PIN' })
  async changePin(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePinDto,
  ) {
    return this.authService.changePin(userId, dto.currentPin, dto.newPin);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('pin/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify wallet PIN' })
  async verifyPin(
    @CurrentUser('id') userId: string,
    @Body() dto: VerifyPinDto,
  ) {
    return this.authService.verifyPin(userId, dto.pin);
  }
}
