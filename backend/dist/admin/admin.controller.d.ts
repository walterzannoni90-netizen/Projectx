import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
        users: import("../users/user.entity").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserDetail(id: string): Promise<{
        user: import("../users/user.entity").User;
        deposits: import("../deposits/deposit.entity").Deposit[];
        withdrawals: import("../withdrawals/withdrawal.entity").Withdrawal[];
        quantizations: import("../quantization/quantization.entity").Quantization[];
    }>;
    updateUserStatus(id: string, status: string): Promise<import("typeorm").UpdateResult>;
    getPendingWithdrawals(): Promise<import("../withdrawals/withdrawal.entity").Withdrawal[]>;
    approveWithdrawal(id: string, adminId: string): Promise<import("../withdrawals/withdrawal.entity").Withdrawal>;
    completeWithdrawal(id: string, txHash: string): Promise<import("../withdrawals/withdrawal.entity").Withdrawal>;
    rejectWithdrawal(id: string, reason: string): Promise<import("../withdrawals/withdrawal.entity").Withdrawal>;
    getStats(): Promise<{
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
