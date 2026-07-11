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
exports.WithdrawalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const withdrawal_entity_1 = require("./withdrawal.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const user_entity_1 = require("../users/user.entity");
const wallets_service_1 = require("../wallets/wallets.service");
const transaction_entity_1 = require("../wallets/transaction.entity");
let WithdrawalsService = class WithdrawalsService {
    constructor(withdrawalRepository, walletRepository, userRepository, walletsService) {
        this.withdrawalRepository = withdrawalRepository;
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.walletsService = walletsService;
    }
    async request(userId, data) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const bcrypt = require('bcrypt');
        if (!user.pinHash || !(await bcrypt.compare(data.pin, user.pinHash))) {
            throw new common_1.BadRequestException('Invalid PIN');
        }
        if (data.amount < 30) {
            throw new common_1.BadRequestException('Minimum withdrawal is 30 USDT');
        }
        const lastWithdrawal = await this.withdrawalRepository.findOne({
            where: { userId, status: withdrawal_entity_1.TransactionStatus.COMPLETED },
            order: { createdAt: 'DESC' },
        });
        if (lastWithdrawal) {
            const hoursSinceLast = (Date.now() - lastWithdrawal.createdAt.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLast < 48) {
                throw new common_1.BadRequestException(`Please wait ${Math.ceil(48 - hoursSinceLast)} hours before next withdrawal`);
            }
        }
        const wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        const userLevel = await this.userRepository.manager.getRepository('UserLevel').findOne({
            where: { userId },
            relations: ['currentLevel'],
        });
        const feePercent = userLevel?.currentLevel?.withdrawalFeePercent || 15;
        const fee = data.amount * (feePercent / 100);
        const totalDeduction = data.amount + fee;
        if (Number(wallet.availableBalance) < totalDeduction) {
            throw new common_1.BadRequestException('Insufficient balance');
        }
        const withdrawal = this.withdrawalRepository.create({
            userId,
            walletId: wallet.id,
            chain: data.chain,
            toAddress: data.toAddress,
            amount: data.amount,
            feePercent,
            fee,
            pinVerified: true,
            pinVerifiedAt: new Date(),
            status: withdrawal_entity_1.TransactionStatus.PENDING,
            amountUsd: data.amount,
        });
        await this.withdrawalRepository.save(withdrawal);
        const oldBalance = Number(wallet.availableBalance);
        wallet.availableBalance = oldBalance - totalDeduction;
        wallet.totalBalance = Number(wallet.totalBalance) - totalDeduction;
        wallet.totalFees = Number(wallet.totalFees) + fee;
        await this.walletRepository.save(wallet);
        await this.walletsService.addTransaction({
            userId,
            walletId: wallet.id,
            type: transaction_entity_1.TransactionType.WITHDRAWAL,
            amount: data.amount,
            fee,
            balanceBefore: oldBalance,
            balanceAfter: Number(wallet.availableBalance),
            referenceType: 'withdrawal',
            referenceId: withdrawal.id,
            description: `Withdrawal of ${data.amount} USDT to ${data.toAddress}`,
        });
        return withdrawal;
    }
    async getUserWithdrawals(userId) {
        return this.withdrawalRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async approveByAdmin(withdrawalId, adminId) {
        const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
        if (!withdrawal)
            throw new common_1.NotFoundException('Withdrawal not found');
        withdrawal.status = withdrawal_entity_1.TransactionStatus.PROCESSING;
        withdrawal.adminApprovedBy = adminId;
        withdrawal.adminApprovedAt = new Date();
        return this.withdrawalRepository.save(withdrawal);
    }
    async complete(withdrawalId, txHash) {
        const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
        if (!withdrawal)
            throw new common_1.NotFoundException('Withdrawal not found');
        withdrawal.status = withdrawal_entity_1.TransactionStatus.COMPLETED;
        withdrawal.txHash = txHash;
        withdrawal.completedAt = new Date();
        const wallet = await this.walletRepository.findOne({ where: { id: withdrawal.walletId } });
        if (wallet) {
            wallet.totalWithdrawn = Number(wallet.totalWithdrawn) + Number(withdrawal.amount);
            await this.walletRepository.save(wallet);
        }
        return this.withdrawalRepository.save(withdrawal);
    }
    async reject(withdrawalId, reason) {
        const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
        if (!withdrawal)
            throw new common_1.NotFoundException('Withdrawal not found');
        withdrawal.status = withdrawal_entity_1.TransactionStatus.CANCELLED;
        withdrawal.rejectionReason = reason;
        const wallet = await this.walletRepository.findOne({ where: { id: withdrawal.walletId } });
        if (wallet) {
            const totalDeduction = Number(withdrawal.amount) + Number(withdrawal.fee);
            wallet.availableBalance = Number(wallet.availableBalance) + totalDeduction;
            wallet.totalBalance = Number(wallet.totalBalance) + totalDeduction;
            await this.walletRepository.save(wallet);
        }
        return this.withdrawalRepository.save(withdrawal);
    }
};
exports.WithdrawalsService = WithdrawalsService;
exports.WithdrawalsService = WithdrawalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(withdrawal_entity_1.Withdrawal)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        wallets_service_1.WalletsService])
], WithdrawalsService);
//# sourceMappingURL=withdrawals.service.js.map