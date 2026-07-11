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
exports.DepositsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deposit_entity_1 = require("./deposit.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const wallets_service_1 = require("../wallets/wallets.service");
const transaction_entity_1 = require("../wallets/transaction.entity");
let DepositsService = class DepositsService {
    constructor(depositRepository, walletRepository, walletsService) {
        this.depositRepository = depositRepository;
        this.walletRepository = walletRepository;
        this.walletsService = walletsService;
    }
    async create(data) {
        const deposit = this.depositRepository.create(data);
        return this.depositRepository.save(deposit);
    }
    async getUserDeposits(userId) {
        return this.depositRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async confirmDeposit(depositId) {
        const deposit = await this.depositRepository.findOne({ where: { id: depositId } });
        if (!deposit)
            throw new common_1.NotFoundException('Deposit not found');
        deposit.status = deposit_entity_1.TransactionStatus.COMPLETED;
        deposit.completedAt = new Date();
        deposit.confirmations = deposit.requiredConfirmations;
        await this.depositRepository.save(deposit);
        const wallet = await this.walletRepository.findOne({ where: { id: deposit.walletId } });
        if (wallet) {
            const oldBalance = wallet.totalBalance;
            wallet.totalBalance = Number(wallet.totalBalance) + Number(deposit.amount);
            wallet.availableBalance = Number(wallet.availableBalance) + Number(deposit.amount);
            wallet.totalDeposited = Number(wallet.totalDeposited) + Number(deposit.amount);
            await this.walletRepository.save(wallet);
            await this.walletsService.addTransaction({
                userId: deposit.userId,
                walletId: wallet.id,
                type: transaction_entity_1.TransactionType.DEPOSIT,
                amount: Number(deposit.amount),
                balanceBefore: oldBalance,
                balanceAfter: Number(wallet.totalBalance),
                referenceType: 'deposit',
                referenceId: deposit.id,
                description: `Deposit of ${deposit.amount} USDT via ${deposit.chain}`,
            });
        }
        return deposit;
    }
};
exports.DepositsService = DepositsService;
exports.DepositsService = DepositsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(deposit_entity_1.Deposit)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        wallets_service_1.WalletsService])
], DepositsService);
//# sourceMappingURL=deposits.service.js.map