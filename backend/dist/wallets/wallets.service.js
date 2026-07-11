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
exports.WalletsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./wallet.entity");
const wallet_address_entity_1 = require("./wallet-address.entity");
const transaction_entity_1 = require("./transaction.entity");
let WalletsService = class WalletsService {
    constructor(walletRepository, addressRepository, transactionRepository) {
        this.walletRepository = walletRepository;
        this.addressRepository = addressRepository;
        this.transactionRepository = transactionRepository;
    }
    async getBalance(userId) {
        const wallet = await this.walletRepository.findOne({ where: { userId } });
        if (!wallet)
            throw new common_1.NotFoundException('Wallet not found');
        return wallet;
    }
    async getTransactions(userId, page = 1, limit = 20, filters) {
        const query = this.transactionRepository.createQueryBuilder('tx')
            .where('tx.user_id = :userId', { userId })
            .orderBy('tx.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        if (filters?.type) {
            query.andWhere('tx.type = :type', { type: filters.type });
        }
        if (filters?.from) {
            query.andWhere('tx.created_at >= :from', { from: filters.from });
        }
        if (filters?.to) {
            query.andWhere('tx.created_at <= :to', { to: filters.to });
        }
        const [transactions, total] = await query.getManyAndCount();
        return { transactions, total, page, limit };
    }
    async getAddresses(userId) {
        return this.addressRepository.find({ where: { userId } });
    }
    async generateAddress(userId, chain) {
        const existing = await this.addressRepository.findOne({ where: { userId, chain } });
        if (existing)
            return existing;
        const address = this.addressRepository.create({
            userId,
            chain,
            address: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            isDefault: true,
        });
        return this.addressRepository.save(address);
    }
    async addTransaction(data) {
        const tx = this.transactionRepository.create(data);
        return this.transactionRepository.save(tx);
    }
};
exports.WalletsService = WalletsService;
exports.WalletsService = WalletsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_address_entity_1.WalletAddress)),
    __param(2, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WalletsService);
//# sourceMappingURL=wallets.service.js.map