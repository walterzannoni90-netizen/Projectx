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
exports.ReferralService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const referral_entity_1 = require("./referral.entity");
const referral_reward_entity_1 = require("./referral-reward.entity");
let ReferralService = class ReferralService {
    constructor(referralRepository, rewardRepository, userRepository) {
        this.referralRepository = referralRepository;
        this.rewardRepository = rewardRepository;
        this.userRepository = userRepository;
    }
    async getTeam(userId) {
        const referrals = await this.referralRepository.find({
            where: { referrerId: userId },
            relations: ['referred'],
            order: { createdAt: 'DESC' },
        });
        return {
            total: referrals.length,
            active: referrals.filter(r => r.isActive).length,
            members: await Promise.all(referrals.map(async (ref) => {
                const user = ref.referred;
                const wallet = await this.userRepository.manager.getRepository('Wallet')
                    .findOne({ where: { userId: user.id } });
                return {
                    id: user.id,
                    nickname: user.nickname,
                    email: user.email.replace(/(?<=.{3}).(?=.*@)/g, '*'),
                    level: ref.level,
                    joinedAt: ref.createdAt,
                    operatingCapital: wallet?.operatingCapital || 0,
                    commissionsEarned: ref.commissionEarned,
                    isActive: ref.isActive,
                };
            })),
        };
    }
    async getRewards(userId) {
        const rewards = await this.rewardRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        const total = rewards.reduce((sum, r) => sum + Number(r.amount), 0);
        return { total, rewards };
    }
    async getReferralTree(userId) {
        const level1 = await this.referralRepository.find({
            where: { referrerId: userId },
            relations: ['referred'],
        });
        const tree = await Promise.all(level1.map(async (l1) => {
            const level2 = await this.referralRepository.find({
                where: { referrerId: l1.referredId },
                relations: ['referred'],
            });
            return {
                user: { id: l1.referred.id, nickname: l1.referred.nickname, email: l1.referred.email },
                level: 1,
                children: level2.map(l2 => ({
                    user: { id: l2.referred.id, nickname: l2.referred.nickname, email: l2.referred.email },
                    level: 2,
                })),
            };
        }));
        return tree;
    }
    async distributeCommission(transactionId, userId, amount) {
        const user = await this.userRepository.manager.getRepository('User')
            .findOne({ where: { id: userId } });
        if (!user?.referredById)
            return;
        const levelConfigs = [
            { level: 1, percent: 0.08 },
            { level: 2, percent: 0.05 },
            { level: 3, percent: 0.03 },
        ];
        let currentReferrerId = user.referredById;
        for (let i = 0; i < 3 && currentReferrerId; i++) {
            const config = levelConfigs[i];
            const commission = amount * config.percent;
            await this.rewardRepository.save({
                referralId: '',
                userId: currentReferrerId,
                fromUserId: userId,
                amount: commission,
                level: config.level,
                percent: config.percent * 100,
                sourceTransactionId: transactionId,
            });
            await this.referralRepository.update({ referrerId: currentReferrerId, referredId: userId }, { commissionEarned: () => `commission_earned + ${commission}` });
            const referrer = await this.userRepository.manager.getRepository('User')
                .findOne({ where: { id: currentReferrerId } });
            currentReferrerId = referrer?.referredById || null;
        }
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(referral_entity_1.Referral)),
    __param(1, (0, typeorm_1.InjectRepository)(referral_reward_entity_1.ReferralReward)),
    __param(2, (0, typeorm_1.InjectRepository)(referral_entity_1.Referral)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository, Object])
], ReferralService);
//# sourceMappingURL=referral.service.js.map