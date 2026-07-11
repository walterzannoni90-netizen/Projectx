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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const profile_entity_1 = require("./profile.entity");
let UsersService = class UsersService {
    constructor(userRepository, profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['profile', 'wallet', 'userLevels'],
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async updateProfile(userId, data) {
        let profile = await this.profileRepository.findOne({ where: { userId } });
        if (!profile) {
            profile = this.profileRepository.create({ userId, ...data });
        }
        else {
            Object.assign(profile, data);
        }
        return this.profileRepository.save(profile);
    }
    async getSessions(userId) {
        const repo = this.userRepository.manager.getRepository('Session');
        return repo.find({
            where: { userId, isActive: true },
            order: { lastActivityAt: 'DESC' },
        });
    }
    async getDashboard(userId) {
        const user = await this.findById(userId);
        const wallet = user.wallet;
        const level = user.userLevels?.[0];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const txRepo = this.userRepository.manager.getRepository('Transaction');
        const todayEarnings = await txRepo
            .createQueryBuilder('tx')
            .where('tx.user_id = :userId', { userId })
            .andWhere('tx.type = :type', { type: 'quantization_earning' })
            .andWhere('tx.created_at >= :today', { today })
            .select('COALESCE(SUM(tx.amount), 0)', 'total')
            .getRawOne();
        const recentTransactions = await txRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 10,
        });
        const quantRepo = this.userRepository.manager.getRepository('Quantization');
        const activeQuantization = await quantRepo.findOne({
            where: { userId, status: 'running' },
        });
        return {
            totalBalance: wallet?.totalBalance || 0,
            operatingCapital: wallet?.operatingCapital || 0,
            availableBalance: wallet?.availableBalance || 0,
            dailyEarnings: Number(todayEarnings?.total || 0),
            totalEarnings: wallet?.totalEarned || 0,
            currentLevel: level?.currentLevelId || null,
            levelProgress: level?.progressPercent || 0,
            activeReferrals: level?.currentReferrals || 0,
            nextQuantizationAt: activeQuantization?.completedAt || null,
            lastTransactions: recentTransactions,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(profile_entity_1.Profile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map