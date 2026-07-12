import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { User, UserStatus } from '../users/user.entity';
import { Profile } from '../users/profile.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Session } from './session.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(UserLevel)
    private userLevelRepository: Repository<UserLevel>,
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check existing user
    const existing = await this.userRepository.findOne({ 
      where: { email: dto.email },
      withDeleted: true,
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Validate referral code
    let referrer: User | null = null;
    if (dto.referralCode) {
      referrer = await this.userRepository.findOne({ 
        where: { referralCode: dto.referralCode } 
      });
      if (!referrer) {
        throw new BadRequestException('Invalid referral code');
      }
    }

    // Generate unique referral code
    let refCode: string;
    do {
      refCode = uuidv4().substring(0, 8).toUpperCase();
    } while (await this.userRepository.findOne({ where: { referralCode: refCode } }));

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = this.userRepository.create({
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      nickname: dto.nickname || dto.email.split('@')[0],
      referralCode: refCode,
      referredById: referrer?.id,
      status: 'active',
      emailVerifiedAt: null,
    });
    await this.userRepository.save(user);

    // Create profile
    const profile = this.profileRepository.create({ userId: user.id });
    await this.profileRepository.save(profile);

    // Create wallet
    const wallet = this.walletRepository.create({ userId: user.id });
    await this.walletRepository.save(wallet);

    // Assign level 1
    const level1 = await this.levelRepository.findOne({ 
      where: { levelNumber: 1 } 
    });
    if (level1) {
      const level2 = await this.levelRepository.findOne({ 
        where: { levelNumber: 2 } 
      });
      await this.userLevelRepository.save({
        userId: user.id,
        currentLevelId: level1.id,
        nextLevelId: level2?.id || null,
        currentCapital: 0,
        targetCapital: level2?.minOperatingCapital || 0,
        currentReferrals: 0,
        targetReferrals: level2?.minReferrals || 0,
      });
    }

    // Handle referral tree
    if (referrer) {
      await this.createReferralTree(user.id, referrer.id);
    }

    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      relations: ['profile', 'wallet', 'userLevels'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is ' + user.status);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshToken(refreshToken: string) {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken, isActive: true },
      relations: ['user'],
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Deactivate old session
    session.isActive = false;
    await this.sessionRepository.save(session);

    // Generate new tokens
    return this.generateTokens(session.user);
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.sessionRepository.update(
        { refreshToken, userId },
        { isActive: false },
      );
    } else {
      await this.sessionRepository.update(
        { userId, isActive: true },
        { isActive: false },
      );
    }
  }

  async logoutAllDevices(userId: string) {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await this.userRepository.save(user);

    // Logout all devices except current
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return; // Don't reveal if email exists

    // In production, send email with reset link
    // For now, generate and store token
    // A production mail provider must create and deliver a short-lived,
    // single-use token. Never log password-reset credentials.
    this.logger.log('Password reset requested');
    return { message: 'If the email exists, a reset link has been sent' };
  }

  async setup2FA(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const secret = speakeasy.generateSecret({
      name: `ProjectX:${user.email}`,
    });

    user.twoFactorSecret = secret.base32;
    await this.userRepository.save(user);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");
    return { secret: secret.base32, qrCode };
  }

  async verify2FA(userId: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not set up');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA token');
    }

    user.twoFactorEnabled = true;
    await this.userRepository.save(user);

    return { message: '2FA enabled successfully' };
  }

  async disable2FA(userId: string, token: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not set up');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!verified) {
      throw new BadRequestException('Invalid 2FA token');
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await this.userRepository.save(user);

    return { message: '2FA disabled successfully' };
  }

  async setPin(userId: string, pin: string) {
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      throw new BadRequestException('PIN must be 6 digits');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    user.pinHash = await bcrypt.hash(pin, 10);
    user.pinSetAt = new Date();
    await this.userRepository.save(user);

    return { message: 'PIN set successfully' };
  }

  async verifyPin(userId: string, pin: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.pinHash) {
      throw new BadRequestException('PIN not set');
    }

    const valid = await bcrypt.compare(pin, user.pinHash);
    if (!valid) {
      throw new BadRequestException('Invalid PIN');
    }

    return { valid: true };
  }

  async changePin(userId: string, currentPin: string, newPin: string) {
    const verified = await this.verifyPin(userId, currentPin);
    if (!verified.valid) {
      throw new BadRequestException('Current PIN is incorrect');
    }
    return this.setPin(userId, newPin);
  }

  private async generateTokens(user: User) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: 'user',
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION', '15m'),
    });

    const refreshToken = uuidv4();
    const session = this.sessionRepository.create({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      lastActivityAt: new Date(),
    });
    await this.sessionRepository.save(session);

    return { accessToken, refreshToken };
  }

  private async createReferralTree(newUserId: string, referrerId: string) {
    // Level 1 referral
    await this.createReferralEntry(referrerId, newUserId, 1);

    // Level 2 referral
    const level1Ref = await this.userRepository.findOne({ 
      where: { id: referrerId },
      select: ['referredById'],
    });
    if (level1Ref?.referredById) {
      await this.createReferralEntry(level1Ref.referredById, newUserId, 2);
    }

    // Level 3 referral
    if (level1Ref?.referredById) {
      const level2Ref = await this.userRepository.findOne({ 
        where: { id: level1Ref.referredById },
        select: ['referredById'],
      });
      if (level2Ref?.referredById) {
        await this.createReferralEntry(level2Ref.referredById, newUserId, 3);
      }
    }
  }

  private async createReferralEntry(referrerId: string, referredId: string, level: number) {
    const repo = this.userRepository.manager.getRepository('Referral');
    await repo.save({
      referrerId,
      referredId,
      level,
      isActive: true,
      commissionEarned: 0,
    });
  }

  sanitizeUser(user: User) {
    const { passwordHash, pinHash, twoFactorSecret, ...safeUser } = user;
    return safeUser;
  }
}
