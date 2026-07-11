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
exports.WalletAddress = exports.WalletChain = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var WalletChain;
(function (WalletChain) {
    WalletChain["TRC20"] = "TRC20";
    WalletChain["BEP20"] = "BEP20";
    WalletChain["ERC20"] = "ERC20";
    WalletChain["POLYGON"] = "POLYGON";
    WalletChain["ARBITRUM"] = "ARBITRUM";
    WalletChain["SOLANA"] = "SOLANA";
})(WalletChain || (exports.WalletChain = WalletChain = {}));
let WalletAddress = class WalletAddress {
};
exports.WalletAddress = WalletAddress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WalletAddress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], WalletAddress.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.walletAddresses),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], WalletAddress.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: WalletChain }),
    __metadata("design:type", String)
], WalletAddress.prototype, "chain", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], WalletAddress.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], WalletAddress.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    __metadata("design:type", Boolean)
], WalletAddress.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WalletAddress.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WalletAddress.prototype, "updatedAt", void 0);
exports.WalletAddress = WalletAddress = __decorate([
    (0, typeorm_1.Entity)('wallet_addresses')
], WalletAddress);
//# sourceMappingURL=wallet-address.entity.js.map