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
exports.Quantization = exports.QuantizationStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var QuantizationStatus;
(function (QuantizationStatus) {
    QuantizationStatus["IDLE"] = "idle";
    QuantizationStatus["RUNNING"] = "running";
    QuantizationStatus["COMPLETED"] = "completed";
    QuantizationStatus["FAILED"] = "failed";
})(QuantizationStatus || (exports.QuantizationStatus = QuantizationStatus = {}));
let Quantization = class Quantization {
};
exports.Quantization = Quantization;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Quantization.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Quantization.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.quantizations),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Quantization.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'wallet_id' }),
    __metadata("design:type", String)
], Quantization.prototype, "walletId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'level_id' }),
    __metadata("design:type", String)
], Quantization.prototype, "levelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_invested', type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], Quantization.prototype, "amountInvested", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_return', type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], Quantization.prototype, "expectedReturn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_return', type: 'decimal', precision: 20, scale: 8, nullable: true }),
    __metadata("design:type", Number)
], Quantization.prototype, "actualReturn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'daily_yield', type: 'decimal', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], Quantization.prototype, "dailyYield", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: QuantizationStatus, default: QuantizationStatus.IDLE }),
    __metadata("design:type", String)
], Quantization.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Quantization.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Quantization.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_seconds', nullable: true }),
    __metadata("design:type", Number)
], Quantization.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Quantization.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Quantization.prototype, "updatedAt", void 0);
exports.Quantization = Quantization = __decorate([
    (0, typeorm_1.Entity)('quantizations')
], Quantization);
//# sourceMappingURL=quantization.entity.js.map