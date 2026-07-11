import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Deposit } from '../deposits/deposit.entity';
import { Withdrawal } from '../withdrawals/withdrawal.entity';
import { Transaction } from '../wallets/transaction.entity';
import { Quantization } from '../quantization/quantization.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';
export declare class AdminService {
    private userRepository;
    private walletRepository;
    private depositRepository;
    private withdrawalRepository;
    private transactionRepository;
    private quantizationRepository;
    private userLevelRepository;
    private levelRepository;
    private withdrawalsService;
    constructor(userRepository: Repository<User>, walletRepository: Repository<Wallet>, depositRepository: Repository<Deposit>, withdrawalRepository: Repository<Withdrawal>, transactionRepository: Repository<Transaction>, quantizationRepository: Repository<Quantization>, userLevelRepository: Repository<UserLevel>, levelRepository: Repository<Level>, withdrawalsService: WithdrawalsService);
    getDashboard(): Promise<{
        totalUsers: number;
        activeUsers: number;
        totalDeposits: number;
        totalWithdrawals: number;
        pendingWithdrawals: number;
        pendingDeposits: number;
        totalFees: number;
    }>;
    getUsers(page?: number, limit?: number, search?: string): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserDetail(userId: string): Promise<{
        user: User;
        deposits: Deposit[];
        withdrawals: Withdrawal[];
        quantizations: Quantization[];
    }>;
    updateUserStatus(userId: string, status: string): Promise<import("typeorm").UpdateResult>;
    approveWithdrawal(withdrawalId: string, adminId: string): Promise<Withdrawal>;
    completeWithdrawal(withdrawalId: string, txHash: string): Promise<Withdrawal>;
    rejectWithdrawal(withdrawalId: string, reason: string): Promise<Withdrawal>;
    getPendingWithdrawals(): Promise<Withdrawal[]>;
    getSystemStats(): Promise<{
        newUsersToday: number;
        newUsersThisMonth: number;
    }>;
    getAuditLogs(page?: number, limit?: number): Promise<{
        logs: import("typeorm").ObjectLiteral[];
        total: number;
        page: number;
        limit: number;
    }>;
}
