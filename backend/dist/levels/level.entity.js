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
exports.Level = void 0;
const typeorm_1 = require("typeorm");
let Level = class Level {
};
exports.Level = Level;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Level.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'level_number', unique: true }),
    __metadata("design:type", Number)
], Level.prototype, "levelNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Level.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_operating_capital', type: 'decimal', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "minOperatingCapital", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_referrals', default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "minReferrals", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_account_days', default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "minAccountDays", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'daily_yield_percent', type: 'decimal', precision: 10, scale: 6 }),
    __metadata("design:type", Number)
], Level.prototype, "dailyYieldPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantizations_per_day', default: 1 }),
    __metadata("design:type", Number)
], Level.prototype, "quantizationsPerDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fee_reduction_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "feeReductionPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_bonus_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Level.prototype, "referralBonusPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_level1_percent', type: 'decimal', precision: 5, scale: 2, default: 8.00 }),
    __metadata("design:type", Number)
], Level.prototype, "referralLevel1Percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_level2_percent', type: 'decimal', precision: 5, scale: 2, default: 5.00 }),
    __metadata("design:type", Number)
], Level.prototype, "referralLevel2Percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_level3_percent', type: 'decimal', precision: 5, scale: 2, default: 3.00 }),
    __metadata("design:type", Number)
], Level.prototype, "referralLevel3Percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'withdrawal_fee_percent', type: 'decimal', precision: 5, scale: 2, default: 15.00 }),
    __metadata("design:type", Number)
], Level.prototype, "withdrawalFeePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Level.prototype, "benefits", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Level.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Level.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Level.prototype, "updatedAt", void 0);
exports.Level = Level = __decorate([
    (0, typeorm_1.Entity)('levels')
], Level);
//# sourceMappingURL=level.entity.js.map