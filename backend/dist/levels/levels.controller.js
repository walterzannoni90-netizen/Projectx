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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LevelsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const levels_service_1 = require("./levels.service");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let LevelsController = class LevelsController {
    constructor(levelsService) {
        this.levelsService = levelsService;
    }
    async getAll() {
        return this.levelsService.getAllLevels();
    }
    async getMyLevel(userId) {
        return this.levelsService.getUserLevel(userId);
    }
    async checkUpgrade(userId) {
        return this.levelsService.checkUpgrade(userId);
    }
    async upgrade(userId) {
        return this.levelsService.performUpgrade(userId);
    }
};
exports.LevelsController = LevelsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all levels' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('my-level'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user level' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "getMyLevel", null);
__decorate([
    (0, common_1.Get)('check-upgrade'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if upgrade is available' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "checkUpgrade", null);
__decorate([
    (0, common_1.Post)('upgrade'),
    (0, swagger_1.ApiOperation)({ summary: 'Perform level upgrade' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LevelsController.prototype, "upgrade", null);
exports.LevelsController = LevelsController = __decorate([
    (0, swagger_1.ApiTags)('Levels'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('levels'),
    __metadata("design:paramtypes", [levels_service_1.LevelsService])
], LevelsController);
//# sourceMappingURL=levels.controller.js.map