"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuantizationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const quantization_controller_1 = require("./quantization.controller");
const quantization_service_1 = require("./quantization.service");
const quantization_entity_1 = require("./quantization.entity");
const quantization_history_entity_1 = require("./quantization-history.entity");
const wallet_entity_1 = require("../wallets/wallet.entity");
const user_level_entity_1 = require("../levels/user-level.entity");
const level_entity_1 = require("../levels/level.entity");
const user_entity_1 = require("../users/user.entity");
const wallets_module_1 = require("../wallets/wallets.module");
const notifications_module_1 = require("../notifications/notifications.module");
let QuantizationModule = class QuantizationModule {
};
exports.QuantizationModule = QuantizationModule;
exports.QuantizationModule = QuantizationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([quantization_entity_1.Quantization, quantization_history_entity_1.QuantizationHistory, wallet_entity_1.Wallet, user_level_entity_1.UserLevel, level_entity_1.Level, user_entity_1.User]),
            wallets_module_1.WalletsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [quantization_controller_1.QuantizationController],
        providers: [quantization_service_1.QuantizationService],
    })
], QuantizationModule);
//# sourceMappingURL=quantization.module.js.map