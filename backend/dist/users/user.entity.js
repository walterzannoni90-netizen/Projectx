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
exports.User = exports.UserStatus = void 0;
const typeorm_1 = require("typeorm");
const profile_entity_1 = require("./profile.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const wallet_address_entity_1 = require("../wallets/wallet-address.entity");
const deposit_entity_1 = require("../deposits/deposit.entity");
const withdrawal_entity_1 = require("../withdrawals/withdrawal.entity");
const transaction_entity_1 = require("../wallets/transaction.entity");
const quantization_entity_1 = require("../quantization/quantization.entity");
const referral_entity_1 = require("../referral/referral.entity");
const user_level_entity_1 = require("../levels/user-level.entity");
const notification_entity_1 = require("../notifications/notification.entity");
const session_entity_1 = require("../auth/session.entity");
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "pending";
    UserStatus["ACTIVE"] = "active";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["BANNED"] = "banned";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash' }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referral_code', unique: true, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referred_by', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "referredById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "emailVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_verified_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "phoneVerifiedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'two_factor_enabled', default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "twoFactorEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'two_factor_secret', nullable: true }),
    __metadata("design:type", Object)
], User.prototype, "twoFactorSecret", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pin_hash', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "pinHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'pin_set_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "pinSetAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_ip', type: 'inet', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => profile_entity_1.Profile, (profile) => profile.user),
    __metadata("design:type", profile_entity_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => wallet_entity_1.Wallet, (wallet) => wallet.user),
    __metadata("design:type", wallet_entity_1.Wallet)
], User.prototype, "wallet", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => wallet_address_entity_1.WalletAddress, (addr) => addr.user),
    __metadata("design:type", Array)
], User.prototype, "walletAddresses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => deposit_entity_1.Deposit, (deposit) => deposit.user),
    __metadata("design:type", Array)
], User.prototype, "deposits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => withdrawal_entity_1.Withdrawal, (withdrawal) => withdrawal.user),
    __metadata("design:type", Array)
], User.prototype, "withdrawals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_entity_1.Transaction, (tx) => tx.user),
    __metadata("design:type", Array)
], User.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quantization_entity_1.Quantization, (q) => q.user),
    __metadata("design:type", Array)
], User.prototype, "quantizations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => referral_entity_1.Referral, (ref) => ref.referred),
    __metadata("design:type", Array)
], User.prototype, "referrals", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_level_entity_1.UserLevel, (ul) => ul.user),
    __metadata("design:type", Array)
], User.prototype, "userLevels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notif) => notif.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => session_entity_1.Session, (session) => session.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map