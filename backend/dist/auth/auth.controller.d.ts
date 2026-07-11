import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SetPinDto, ChangePinDto, VerifyPinDto } from './dto/pin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
            status: import("../users/user.entity").UserStatus;
            emailVerifiedAt: Date;
            phoneVerifiedAt: Date;
            twoFactorEnabled: boolean;
            pinSetAt: Date;
            lastLoginAt: Date;
            lastLoginIp: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            profile: import("../users/profile.entity").Profile;
            wallet: import("../wallets/wallet.entity").Wallet;
            walletAddresses: import("../wallets/wallet-address.entity").WalletAddress[];
            deposits: import("../deposits/deposit.entity").Deposit[];
            withdrawals: import("../withdrawals/withdrawal.entity").Withdrawal[];
            transactions: import("../wallets/transaction.entity").Transaction[];
            quantizations: import("../quantization/quantization.entity").Quantization[];
            referrals: import("../referral/referral.entity").Referral[];
            userLevels: import("../levels/user-level.entity").UserLevel[];
            notifications: import("../notifications/notification.entity").Notification[];
            sessions: import("./session.entity").Session[];
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
            status: import("../users/user.entity").UserStatus;
            emailVerifiedAt: Date;
            phoneVerifiedAt: Date;
            twoFactorEnabled: boolean;
            pinSetAt: Date;
            lastLoginAt: Date;
            lastLoginIp: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date;
            profile: import("../users/profile.entity").Profile;
            wallet: import("../wallets/wallet.entity").Wallet;
            walletAddresses: import("../wallets/wallet-address.entity").WalletAddress[];
            deposits: import("../deposits/deposit.entity").Deposit[];
            withdrawals: import("../withdrawals/withdrawal.entity").Withdrawal[];
            transactions: import("../wallets/transaction.entity").Transaction[];
            quantizations: import("../quantization/quantization.entity").Quantization[];
            referrals: import("../referral/referral.entity").Referral[];
            userLevels: import("../levels/user-level.entity").UserLevel[];
            notifications: import("../notifications/notification.entity").Notification[];
            sessions: import("./session.entity").Session[];
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<void>;
    forgotPassword(email: string): Promise<{
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
    setPin(userId: string, dto: SetPinDto): Promise<{
        message: string;
    }>;
    changePin(userId: string, dto: ChangePinDto): Promise<{
        message: string;
    }>;
    verifyPin(userId: string, dto: VerifyPinDto): Promise<{
        valid: boolean;
    }>;
}
