"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const uuid_1 = require("uuid");
const user_entity_1 = require("../users/user.entity");
const profile_entity_1 = require("../users/profile.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const session_entity_1 = require("./session.entity");
const user_level_entity_1 = require("../levels/user-level.entity");
const level_entity_1 = require("../levels/level.entity");
let AuthService = AuthService_1 = class AuthService {
    constructor(userRepository, profileRepository, walletRepository, sessionRepository, userLevelRepository, levelRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.walletRepository = walletRepository;
        this.sessionRepository = sessionRepository;
        this.userLevelRepository = userLevelRepository;
        this.levelRepository = levelRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({
            where: { email: dto.email },
            withDeleted: true,
        });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        let referrer = null;
        if (dto.referralCode) {
            referrer = await this.userRepository.findOne({
                where: { referralCode: dto.referralCode }
            });
            if (!referrer) {
                throw new common_1.BadRequestException('Invalid referral code');
            }
        }
        let refCode;
        do {
            refCode = (0, uuid_1.v4)().substring(0, 8).toUpperCase();
        } while (await this.userRepository.findOne({ where: { referralCode: refCode } }));
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = this.userRepository.create({
            email: dto.email,
            phone: dto.phone,
            passwordHash,
            nickname: dto.nickname || dto.email.split('@')[0],
            referralCode: refCode,
            referredById: referrer?.id,
            status: user_entity_1.UserStatus.ACTIVE,
            emailVerifiedAt: new Date(),
        });
        await this.userRepository.save(user);
        const profile = this.profileRepository.create({ userId: user.id });
        await this.profileRepository.save(profile);
        const wallet = this.walletRepository.create({ userId: user.id });
        await this.walletRepository.save(wallet);
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
        if (referrer) {
            await this.createReferralTree(user.id, referrer.id);
        }
        const tokens = await this.generateTokens(user);
        return { user: this.sanitizeUser(user), ...tokens };
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
            relations: ['profile', 'wallet', 'userLevels'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status !== user_entity_1.UserStatus.ACTIVE) {
            throw new common_1.UnauthorizedException('Account is ' + user.status);
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        const tokens = await this.generateTokens(user);
        return { user: this.sanitizeUser(user), ...tokens };
    }
    async refreshToken(refreshToken) {
        const session = await this.sessionRepository.findOne({
            where: { refreshToken, isActive: true },
            relations: ['user'],
        });
        if (!session || session.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        session.isActive = false;
        await this.sessionRepository.save(session);
        return this.generateTokens(session.user);
    }
    async logout(userId, refreshToken) {
        if (refreshToken) {
            await this.sessionRepository.update({ refreshToken, userId }, { isActive: false });
        }
        else {
            await this.sessionRepository.update({ userId, isActive: true }, { isActive: false });
        }
    }
    async logoutAllDevices(userId) {
        await this.sessionRepository.update({ userId, isActive: true }, { isActive: false });
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid)
            throw new common_1.BadRequestException('Current password is incorrect');
        user.passwordHash = await bcrypt.hash(newPassword, 12);
        await this.userRepository.save(user);
        await this.sessionRepository.update({ userId, isActive: true }, { isActive: false });
    }
    async requestPasswordReset(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            return;
        const resetToken = (0, uuid_1.v4)();
        this.logger.log(`Password reset requested for ${email}: ${resetToken}`);
        return { message: 'If the email exists, a reset link has been sent' };
    }
    async setup2FA(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const secret = speakeasy.generateSecret({
            name: `ProjectX:${user.email}`,
        });
        user.twoFactorSecret = secret.base32;
        await this.userRepository.save(user);
        const qrCode = await QRCode.toDataURL(secret.otpauth_url || "");
        return { secret: secret.base32, qrCode };
    }
    async verify2FA(userId, token) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('2FA not set up');
        }
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });
        if (!verified) {
            throw new common_1.BadRequestException('Invalid 2FA token');
        }
        user.twoFactorEnabled = true;
        await this.userRepository.save(user);
        return { message: '2FA enabled successfully' };
    }
    async disable2FA(userId, token) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('2FA not set up');
        }
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token,
        });
        if (!verified) {
            throw new common_1.BadRequestException('Invalid 2FA token');
        }
        user.twoFactorEnabled = false;
        user.twoFactorSecret = null;
        await this.userRepository.save(user);
        return { message: '2FA disabled successfully' };
    }
    async setPin(userId, pin) {
        if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
            throw new common_1.BadRequestException('PIN must be 6 digits');
        }
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        user.pinHash = await bcrypt.hash(pin, 10);
        user.pinSetAt = new Date();
        await this.userRepository.save(user);
        return { message: 'PIN set successfully' };
    }
    async verifyPin(userId, pin) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user || !user.pinHash) {
            throw new common_1.BadRequestException('PIN not set');
        }
        const valid = await bcrypt.compare(pin, user.pinHash);
        if (!valid) {
            throw new common_1.BadRequestException('Invalid PIN');
        }
        return { valid: true };
    }
    async changePin(userId, currentPin, newPin) {
        const verified = await this.verifyPin(userId, currentPin);
        if (!verified.valid) {
            throw new common_1.BadRequestException('Current PIN is incorrect');
        }
        return this.setPin(userId, newPin);
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: 'user',
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
        });
        const refreshToken = (0, uuid_1.v4)();
        const session = this.sessionRepository.create({
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            lastActivityAt: new Date(),
        });
        await this.sessionRepository.save(session);
        return { accessToken, refreshToken };
    }
    async createReferralTree(newUserId, referrerId) {
        await this.createReferralEntry(referrerId, newUserId, 1);
        const level1Ref = await this.userRepository.findOne({
            where: { id: referrerId },
            select: ['referredById'],
        });
        if (level1Ref?.referredById) {
            await this.createReferralEntry(level1Ref.referredById, newUserId, 2);
        }
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
    async createReferralEntry(referrerId, referredId, level) {
        const repo = this.userRepository.manager.getRepository('Referral');
        await repo.save({
            referrerId,
            referredId,
            level,
            isActive: true,
            commissionEarned: 0,
        });
    }
    sanitizeUser(user) {
        const { passwordHash, pinHash, twoFactorSecret, ...safeUser } = user;
        return safeUser;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __param(2, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(3, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __param(4, (0, typeorm_1.InjectRepository)(user_level_entity_1.UserLevel)),
    __param(5, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map