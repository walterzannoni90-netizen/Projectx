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
var QuantizationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantizationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const quantization_entity_1 = require("./quantization.entity");
const quantization_history_entity_1 = require("./quantization-history.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const user_level_entity_1 = require("../levels/user-level.entity");
const level_entity_1 = require("../levels/level.entity");
const wallets_service_1 = require("../wallets/wallets.service");
const transaction_entity_1 = require("../wallets/transaction.entity");
let QuantizationService = QuantizationService_1 = class QuantizationService {
    constructor(quantRepository, historyRepository, walletRepository, userLevelRepository, levelRepository, walletsService) {
        this.quantRepository = quantRepository;
        this.historyRepository = historyRepository;
        this.walletRepository = walletRepository;
        this.userLevelRepository = userLevelRepository;
        this.levelRepository = levelRepository;
        this.walletsService = walletsService;
        this.logger = new common_1.Logger(QuantizationService_1.name);
    }
    async startQuantization(userId) {
        const active = await this.quantRepository.findOne({
            where: { userId, status: quantization_entity_1.QuantizationStatus.RUNNING },
        });
        if (active) {
            throw new common_1.BadRequestException('Quantization already in progress');
        }
        const userLevel = await this.userLevelRepository.findOne({
            where: { userId },
            relations: ['currentLevel'],
        });
        if (!userLevel)
            throw new common_1.BadRequestException('User level not found');
        const level = userLevel.currentLevel;
        if (!level)
            throw new common_1.BadRequestException('Level configuration not found');
        const wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        const capital = Number(wallet.operatingCapital);
        if (capital <= 0) {
            throw new common_1.BadRequestException('No operating capital available');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCompleted = await this.quantRepository
            .createQueryBuilder('q')
            .where('q.user_id = :userId', { userId })
            .andWhere('q.status = :status', { status: quantization_entity_1.QuantizationStatus.COMPLETED })
            .andWhere('q.completed_at >= :today', { today })
            .getCount();
        if (todayCompleted >= level.quantizationsPerDay) {
            throw new common_1.BadRequestException(`Daily quantization limit reached (${level.quantizationsPerDay})`);
        }
        const dailyYield = capital * (Number(level.dailyYieldPercent) / 100);
        const expectedReturn = dailyYield;
        const quantization = this.quantRepository.create({
            userId,
            walletId: wallet.id,
            levelId: level.id,
            amountInvested: capital,
            expectedReturn,
            dailyYield: dailyYield,
            status: quantization_entity_1.QuantizationStatus.RUNNING,
            startedAt: new Date(),
        });
        await this.quantRepository.save(quantization);
        const oldBalance = Number(wallet.availableBalance);
        wallet.availableBalance = oldBalance - capital;
        wallet.operatingCapital = capital;
        await this.walletRepository.save(wallet);
        this.logger.log(`Quantization started for user ${userId}: ${capital} USDT at ${level.dailyYieldPercent}%`);
        return quantization;
    }
    async completeQuantization(quantizationId) {
        const quant = await this.quantRepository.findOne({ where: { id: quantizationId } });
        if (!quant || quant.status !== quantization_entity_1.QuantizationStatus.RUNNING) {
            throw new common_1.BadRequestException('Invalid quantization');
        }
        const durationMs = Date.now() - quant.startedAt.getTime();
        const durationSeconds = Math.floor(durationMs / 1000);
        const actualReturn = Number(quant.expectedReturn);
        quant.status = quantization_entity_1.QuantizationStatus.COMPLETED;
        quant.actualReturn = actualReturn;
        quant.completedAt = new Date();
        quant.durationSeconds = durationSeconds;
        await this.quantRepository.save(quant);
        await this.historyRepository.save({
            quantizationId: quant.id,
            userId: quant.userId,
            cycleNumber: 1,
            amount: Number(quant.amountInvested),
            returnAmount: actualReturn,
            yieldPercent: Number(quant.dailyYield) / Number(quant.amountInvested) * 100,
            status: quantization_entity_1.QuantizationStatus.COMPLETED,
            completedAt: new Date(),
        });
        const wallet = await this.walletRepository.findOne({ where: { id: quant.walletId } });
        if (wallet) {
            const oldBalance = Number(wallet.totalBalance);
            wallet.totalBalance = oldBalance + actualReturn;
            wallet.availableBalance = Number(wallet.availableBalance) + Number(quant.amountInvested) + actualReturn;
            wallet.totalEarned = Number(wallet.totalEarned) + actualReturn;
            await this.walletRepository.save(wallet);
            await this.walletsService.addTransaction({
                userId: quant.userId,
                walletId: wallet.id,
                type: transaction_entity_1.TransactionType.QUANTIZATION_EARNING,
                amount: actualReturn,
                balanceBefore: oldBalance,
                balanceAfter: Number(wallet.totalBalance),
                referenceType: 'quantization',
                referenceId: quant.id,
                description: `Quantization earning: ${actualReturn.toFixed(4)} USDT`,
                metadata: { amountInvested: quant.amountInvested, yieldPercent: quant.dailyYield },
            });
        }
        this.logger.log(`Quantization completed for user ${quant.userId}: earned ${actualReturn} USDT`);
        return quant;
    }
    async getStatus(userId) {
        const active = await this.quantRepository.findOne({
            where: { userId, status: quantization_entity_1.QuantizationStatus.RUNNING },
        });
        const completed = await this.quantRepository.find({
            where: { userId, status: quantization_entity_1.QuantizationStatus.COMPLETED },
            order: { completedAt: 'DESC' },
            take: 20,
        });
        const totalEarned = completed.reduce((sum, q) => sum + Number(q.actualReturn || 0), 0);
        return {
            active,
            completed: completed.length,
            history: completed,
            totalEarned,
            nextQuantizationAt: active?.completedAt || null,
        };
    }
    async processQuantizations() {
        const running = await this.quantRepository.find({
            where: { status: quantization_entity_1.QuantizationStatus.RUNNING },
        });
        for (const quant of running) {
            const elapsed = Date.now() - quant.startedAt.getTime();
            if (elapsed >= 120000) {
                try {
                    await this.completeQuantization(quant.id);
                }
                catch (err) {
                    this.logger.error(`Failed to complete quantization ${quant.id}: ${err.message}`);
                }
            }
        }
    }
};
exports.QuantizationService = QuantizationService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuantizationService.prototype, "processQuantizations", null);
exports.QuantizationService = QuantizationService = QuantizationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quantization_entity_1.Quantization)),
    __param(1, (0, typeorm_1.InjectRepository)(quantization_history_entity_1.QuantizationHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(3, (0, typeorm_1.InjectRepository)(user_level_entity_1.UserLevel)),
    __param(4, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        wallets_service_1.WalletsService])
], QuantizationService);
//# sourceMappingURL=quantization.service.js.map