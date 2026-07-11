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
exports.LevelsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const level_entity_1 = require("./level.entity");
const user_level_entity_1 = require("./user-level.entity");
let LevelsService = class LevelsService {
    constructor(levelRepository, userLevelRepository) {
        this.levelRepository = levelRepository;
        this.userLevelRepository = userLevelRepository;
    }
    async getAllLevels() {
        return this.levelRepository.find({ where: { isActive: true }, order: { levelNumber: 'ASC' } });
    }
    async getUserLevel(userId) {
        const userLevel = await this.userLevelRepository.findOne({
            where: { userId },
            relations: ['currentLevel'],
        });
        if (!userLevel)
            return null;
        let nextLevel = null;
        if (userLevel.nextLevelId) {
            nextLevel = await this.levelRepository.findOne({ where: { id: userLevel.nextLevelId } });
        }
        return {
            current: userLevel.currentLevel,
            next: nextLevel,
            progress: {
                capital: { current: userLevel.currentCapital, target: userLevel.targetCapital },
                referrals: { current: userLevel.currentReferrals, target: userLevel.targetReferrals },
                percent: userLevel.progressPercent,
            },
            upgradedAt: userLevel.upgradedAt,
        };
    }
    async checkUpgrade(userId) {
        const userLevel = await this.userLevelRepository.findOne({
            where: { userId },
            relations: ['currentLevel'],
        });
        if (!userLevel || !userLevel.nextLevelId)
            return { canUpgrade: false };
        const nextLevel = await this.levelRepository.findOne({ where: { id: userLevel.nextLevelId } });
        if (!nextLevel)
            return { canUpgrade: false };
        const wallet = await this.userLevelRepository.manager.getRepository('Wallet')
            .findOne({ where: { userId } });
        const capital = Number(wallet?.operatingCapital || 0);
        const referralCount = userLevel.currentReferrals;
        const canUpgrade = capital >= Number(nextLevel.minOperatingCapital) &&
            referralCount >= nextLevel.minReferrals;
        return {
            canUpgrade,
            requirements: {
                capital: { current: capital, needed: Number(nextLevel.minOperatingCapital) },
                referrals: { current: referralCount, needed: nextLevel.minReferrals },
                accountDays: { current: 0, needed: nextLevel.minAccountDays },
            },
        };
    }
    async performUpgrade(userId) {
        const userLevel = await this.userLevelRepository.findOne({
            where: { userId },
        });
        if (!userLevel || !userLevel.nextLevelId) {
            throw new common_1.BadRequestException('Cannot upgrade: no next level');
        }
        const nextLevel = await this.levelRepository.findOne({ where: { id: userLevel.nextLevelId } });
        if (!nextLevel)
            throw new common_1.BadRequestException('Next level not found');
        const nextNextLevel = await this.levelRepository.findOne({
            where: { levelNumber: nextLevel.levelNumber + 1 },
        });
        userLevel.currentLevelId = userLevel.nextLevelId;
        userLevel.nextLevelId = nextNextLevel?.id || null;
        userLevel.upgradedAt = new Date();
        userLevel.progressPercent = 0;
        return this.userLevelRepository.save(userLevel);
    }
};
exports.LevelsService = LevelsService;
exports.LevelsService = LevelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(level_entity_1.Level)),
    __param(1, (0, typeorm_1.InjectRepository)(user_level_entity_1.UserLevel)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LevelsService);
//# sourceMappingURL=levels.service.js.map