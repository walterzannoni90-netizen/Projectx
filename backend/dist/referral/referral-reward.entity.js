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
exports.ReferralReward = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const referral_entity_1 = require("./referral.entity");
let ReferralReward = class ReferralReward {
};
exports.ReferralReward = ReferralReward;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReferralReward.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_id' }),
    __metadata("design:type", String)
], ReferralReward.prototype, "referralId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => referral_entity_1.Referral),
    (0, typeorm_1.JoinColumn)({ name: 'referral_id' }),
    __metadata("design:type", referral_entity_1.Referral)
], ReferralReward.prototype, "referral", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], ReferralReward.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ReferralReward.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_user_id' }),
    __metadata("design:type", String)
], ReferralReward.prototype, "fromUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 20, scale: 8 }),
    __metadata("design:type", Number)
], ReferralReward.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReferralReward.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], ReferralReward.prototype, "percent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_transaction_id', nullable: true }),
    __metadata("design:type", String)
], ReferralReward.prototype, "sourceTransactionId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ReferralReward.prototype, "createdAt", void 0);
exports.ReferralReward = ReferralReward = __decorate([
    (0, typeorm_1.Entity)('referral_rewards')
], ReferralReward);
//# sourceMappingURL=referral-reward.entity.js.map