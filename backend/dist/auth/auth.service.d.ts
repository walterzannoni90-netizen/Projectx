import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/user.entity';
import { Profile } from '../users/profile.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Session } from './session.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userRepository;
    private profileRepository;
    private walletRepository;
    private sessionRepository;
    private userLevelRepository;
    private levelRepository;
    private jwtService;
    private configService;
    private readonly logger;
    constructor(userRepository: Repository<User>, profileRepository: Repository<Profile>, walletRepository: Repository<Wallet>, sessionRepository: Repository<Session>, userLevelRepository: Repository<UserLevel>, levelRepository: Repository<Level>, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            phone: string;
            nickname: string;
            referralCode: string;
            referredById: string;
            status: UserStatus;
            emailVerifiedAt: Date;
            phoneVerifiedAt: Date;
            twoFactorEnabled: boolean;
            pinSetAt: Date;
            lastLoginAt: Date;
            lastLoginIp: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            profile: Profile;
            wallet: Wallet;
            walletAddresses: import("../wallets/wallet-address.entity").WalletAddress[];
            deposits: import("../deposits/deposit.entity").Deposit[];
            withdrawals: import("../withdrawals/withdrawal.entity").Withdrawal[];
            transactions: import("../wallets/transaction.entity").Transaction[];
            quantizations: import("../quantization/quantization.entity").Quantization[];
            referrals: import("../referral/referral.entity").Referral[];
            userLevels: UserLevel[];
            notifications: import("../notifications/notification.entity").Notification[];
            sessions: Session[];
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            phone: string;
            nickname: string;
            referralCode: string;
            referredById: string;
            status: UserStatus;
            emailVerifiedAt: Date;
            phoneVerifiedAt: Date;
            twoFactorEnabled: boolean;
            pinSetAt: Date;
            lastLoginAt: Date;
            lastLoginIp: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            profile: Profile;
            wallet: Wallet;
            walletAddresses: import("../wallets/wallet-address.entity").WalletAddress[];
            deposits: import("../deposits/deposit.entity").Deposit[];
            withdrawals: import("../withdrawals/withdrawal.entity").Withdrawal[];
            transactions: import("../wallets/transaction.entity").Transaction[];
            quantizations: import("../quantization/quantization.entity").Quantization[];
            referrals: import("../referral/referral.entity").Referral[];
            userLevels: UserLevel[];
            notifications: import("../notifications/notification.entity").Notification[];
            sessions: Session[];
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<void>;
    logoutAllDevices(userId: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    } | undefined>;
    setup2FA(userId: string): Promise<{
        secret: string;
        qrCode: string;
    }>;
    verify2FA(userId: string, token: string): Promise<{
        message: string;
    }>;
    disable2FA(userId: string, token: string): Promise<{
        message: string;
    }>;
    setPin(userId: string, pin: string): Promise<{
        message: string;
    }>;
    verifyPin(userId: string, pin: string): Promise<{
        valid: boolean;
    }>;
    changePin(userId: string, currentPin: string, newPin: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private createReferralTree;
    private createReferralEntry;
    sanitizeUser(user: User): {
        id: string;
        email: string;
        phone: string;
        nickname: string;
        referralCode: string;
        referredById: string;
        status: UserStatus;
        emailVerifiedAt: Date;
        phoneVerifiedAt: Date;
        twoFactorEnabled: boolean;
        pinSetAt: Date;
        lastLoginAt: Date;
        lastLoginIp: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date;
        profile: Profile;
        wallet: Wallet;
        walletAddresses: import("../wallets/wallet-address.entity").WalletAddress[];
        deposits: import("../deposits/deposit.entity").Deposit[];
        withdrawals: import("../withdrawals/withdrawal.entity").Withdrawal[];
        transactions: import("../wallets/transaction.entity").Transaction[];
        quantizations: import("../quantization/quantization.entity").Quantization[];
        referrals: import("../referral/referral.entity").Referral[];
        userLevels: UserLevel[];
        notifications: import("../notifications/notification.entity").Notification[];
        sessions: Session[];
    };
}
