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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const deposit_entity_1 = require("../deposits/deposit.entity");
const withdrawal_entity_1 = require("../withdrawals/withdrawal.entity");
const transaction_entity_1 = require("../wallets/transaction.entity");
const quantization_entity_1 = require("../quantization/quantization.entity");
const user_level_entity_1 = require("../levels/user-level.entity");
const level_entity_1 = require("../levels/level.entity");
const withdrawals_service_1 = require("../withdrawals/withdrawals.service");
let AdminService = class AdminService {
    constructor(userRepository, walletRepository, depositRepository, withdrawalRepository, transactionRepository, quantizationRepository, userLevelRepository, levelRepository, withdrawalsService) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.depositRepository = depositRepository;
        this.withdrawalRepository = withdrawalRepository;
        this.transactionRepository = transactionRepository;
        this.quantizationRepository = quantizationRepository;
        this.userLevelRepository = userLevelRepository;
        this.levelRepository = levelRepository;
        this.withdrawalsService = withdrawalsService;
    }
    async getDashboard() {
        const totalUsers = await this.userRepository.count();
        const activeUsers = await this.userRepository.count({ where: { status: 'active' } });
        const totalDeposits = await this.depositRepository
            .createQueryBuilder('d')
            .select('COALESCE(SUM(d.amount), 0)', 'total')
            .where('d.status = :status', { status: 'completed' })
            .getRawOne();
        const totalWithdrawals = await this.withdrawalRepository
            .createQueryBuilder('w')
            .select('COALESCE(SUM(w.amount), 0)', 'total')
            .where('w.status = :status', { status: 'completed' })
            .getRawOne();
        const pendingWithdrawals = await this.withdrawalRepository.count({
            where: { status: 'pending' },
        });
        const pendingDeposits = await this.depositRepository.count({
            where: { status: 'pending' },
        });
        const totalFees = await this.transactionRepository
            .createQueryBuilder('t')
            .select('COALESCE(SUM(t.fee), 0)', 'total')
            .getRawOne();
        return {
            totalUsers,
            activeUsers,
            totalDeposits: Number(totalDeposits?.total || 0),
            totalWithdrawals: Number(totalWithdrawals?.total || 0),
            pendingWithdrawals,
            pendingDeposits,
            totalFees: Number(totalFees?.total || 0),
        };
    }
    async getUsers(page = 1, limit = 20, search) {
        const query = this.userRepository.createQueryBuilder('u')
            .leftJoinAndSelect('u.wallet', 'wallet')
            .leftJoinAndSelect('u.userLevels', 'userLevel')
            .orderBy('u.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (search) {
            query.where('u.email ILIKE :search OR u.nickname ILIKE :search', { search: `%${search}%` });
        }
        const [users, total] = await query.getManyAndCount();
        return { users, total, page, limit };
    }
    async getUserDetail(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['profile', 'wallet', 'userLevels', 'userLevels.currentLevel'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const deposits = await this.depositRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        const withdrawals = await this.withdrawalRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        const quantizations = await this.quantizationRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        return { user, deposits, withdrawals, quantizations };
    }
    async updateUserStatus(userId, status) {
        return this.userRepository.update(userId, { status: status });
    }
    async approveWithdrawal(withdrawalId, adminId) {
        return this.withdrawalsService.approveByAdmin(withdrawalId, adminId);
    }
    async completeWithdrawal(withdrawalId, txHash) {
        return this.withdrawalsService.complete(withdrawalId, txHash);
    }
    async rejectWithdrawal(withdrawalId, reason) {
        return this.withdrawalsService.reject(withdrawalId, reason);
    }
    async getPendingWithdrawals() {
        return this.withdrawalRepository.find({
            where: { status: 'pending' },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
    }
    async getSystemStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const newUsersToday = await this.userRepository
            .createQueryBuilder('u')
            .where('u.created_at >= :today', { today })
            .getCount();
        const newUsersThisMonth = await this.userRepository
            .createQueryBuilder('u')
            .where('u.created_at >= :month', { month: thisMonth })
            .getCount();
        return {
            newUsersToday,
            newUsersThisMonth,
        };
    }
    async getAuditLogs(page = 1, limit = 50) {
        const repo = this.userRepository.manager.getRepository('AuditLog');
        const [logs, total] = await repo.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { logs, total, page, limit };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(2, (0, typeorm_1.InjectRepository)(deposit_entity_1.Deposit)),
    __param(3, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.Withdrawal)),
    __param(4, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(5, (0, typeorm_1.InjectRepository)(quantization_entity_1.Quantization)),
    __param(6, (0, typeorm_1.InjectRepository)(user_level_entity_1.UserLevel)),
    __param(7, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        withdrawals_service_1.WithdrawalsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map