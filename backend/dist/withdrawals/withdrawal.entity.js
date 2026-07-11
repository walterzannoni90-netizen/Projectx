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
exports.Withdrawal = exports.WalletChain = exports.TransactionStatus = void 0;
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
let Withdrawal = class Withdrawal {
};
exports.Withdrawal = Withdrawal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Withdrawal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Withdrawal.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.withdrawals),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Withdrawal.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wallet_id' }),
    __metadata("design:type", String)
], Withdrawal.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WalletChain }),
    __metadata("design:type", String)
], Withdrawal.prototype, "chain", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_address', type: 'text' }),
    __metadata("design:type", String)
], Withdrawal.prototype, "toAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_usd', type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "amountUsd", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_percent', type: 'decimal', precision: 5, scale: 2, default: 15.00 }),
    __metadata("design:type", Number)
], Withdrawal.prototype, "feePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pin_verified', default: false }),
    __metadata("design:type", Boolean)
], Withdrawal.prototype, "pinVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pin_verified_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "pinVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_approved_by', nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "adminApprovedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_approved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "adminApprovedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tx_hash', nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "txHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING }),
    __metadata("design:type", String)
], Withdrawal.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', nullable: true }),
    __metadata("design:type", String)
], Withdrawal.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Withdrawal.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Withdrawal.prototype, "updatedAt", void 0);
exports.Withdrawal = Withdrawal = __decorate([
    (0, typeorm_1.Entity)('withdrawals')
], Withdrawal);
//# sourceMappingURL=withdrawal.entity.js.map