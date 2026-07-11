"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const user_entity_1 = require("../users/user.entity");
const profile_entity_1 = require("../users/profile.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const deposit_entity_1 = require("../deposits/deposit.entity");
const withdrawal_entity_1 = require("../withdrawals/withdrawal.entity");
const transaction_entity_1 = require("../wallets/transaction.entity");
const quantization_entity_1 = require("../quantization/quantization.entity");
const referral_entity_1 = require("../referral/referral.entity");
const user_level_entity_1 = require("../levels/user-level.entity");
const level_entity_1 = require("../levels/level.entity");
const notification_entity_1 = require("../notifications/notification.entity");
const withdrawals_module_1 = require("../withdrawals/withdrawals.module");
const notifications_module_1 = require("../notifications/notifications.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User, profile_entity_1.Profile, wallet_entity_1.Wallet, deposit_entity_1.Deposit, withdrawal_entity_1.Withdrawal, transaction_entity_1.Transaction,
                quantization_entity_1.Quantization, referral_entity_1.Referral, user_level_entity_1.UserLevel, level_entity_1.Level, notification_entity_1.Notification,
            ]),
            withdrawals_module_1.WithdrawalsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map