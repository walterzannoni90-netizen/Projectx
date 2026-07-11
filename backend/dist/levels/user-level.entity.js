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
exports.UserLevel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const level_entity_1 = require("./level.entity");
let UserLevel = class UserLevel {
};
exports.UserLevel = UserLevel;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserLevel.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserLevel.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.userLevels),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserLevel.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_level_id' }),
    __metadata("design:type", String)
], UserLevel.prototype, "currentLevelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => level_entity_1.Level),
    (0, typeorm_1.JoinColumn)({ name: 'current_level_id' }),
    __metadata("design:type", level_entity_1.Level)
], UserLevel.prototype, "currentLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'next_level_id', nullable: true }),
    __metadata("design:type", Object)
], UserLevel.prototype, "nextLevelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_capital', type: 'decimal', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], UserLevel.prototype, "currentCapital", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_capital', type: 'decimal', precision: 20, scale: 8, default: 0 }),
    __metadata("design:type", Number)
], UserLevel.prototype, "targetCapital", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_referrals', default: 0 }),
    __metadata("design:type", Number)
], UserLevel.prototype, "currentReferrals", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_referrals', default: 0 }),
    __metadata("design:type", Number)
], UserLevel.prototype, "targetReferrals", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'progress_percent', type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], UserLevel.prototype, "progressPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'upgraded_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], UserLevel.prototype, "upgradedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserLevel.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], UserLevel.prototype, "updatedAt", void 0);
exports.UserLevel = UserLevel = __decorate([
    (0, typeorm_1.Entity)('user_levels')
], UserLevel);
//# sourceMappingURL=user-level.entity.js.map