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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposit = exports.WalletChain = exports.TransactionStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["PROCESSING"] = "processing";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["CANCELLED"] = "cancelled";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var WalletChain;
(function (WalletChain) {
    WalletChain["TRC20"] = "TRC20";
    WalletChain["BEP20"] = "BEP20";
    WalletChain["ERC20"] = "ERC20";
    WalletChain["POLYGON"] = "POLYGON";
    WalletChain["ARBITRUM"] = "ARBITRUM";
    WalletChain["SOLANA"] = "SOLANA";
})(WalletChain || (exports.WalletChain = WalletChain = {}));
let Deposit = class Deposit {
};
exports.Deposit = Deposit;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Deposit.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Deposit.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.deposits),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Deposit.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wallet_id' }),
    __metadata("design:type", String)
], Deposit.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WalletChain }),
    __metadata("design:type", String)
], Deposit.prototype, "chain", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_hash', nullable: true, unique: true }),
    __metadata("design:type", String)
], Deposit.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_address', type: 'text' }),
    __metadata("design:type", String)
], Deposit.prototype, "fromAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_address', type: 'text' }),
    __metadata("design:type", String)
], Deposit.prototype, "toAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], Deposit.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_usd', type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Deposit.prototype, "amountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], Deposit.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Deposit.prototype, "confirmations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'required_confirmations', default: 12 }),
    __metadata("design:type", Number)
], Deposit.prototype, "requiredConfirmations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING }),
    __metadata("design:type", String)
], Deposit.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Deposit.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Deposit.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Deposit.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Deposit.prototype, "updatedAt", void 0);
exports.Deposit = Deposit = __decorate([
    (0, typeorm_1.Entity)('deposits')
], Deposit);
//# sourceMappingURL=deposit.entity.js.map