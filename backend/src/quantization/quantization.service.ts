import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Quantization, QuantizationStatus } from './quantization.entity';
import { QuantizationHistory } from './quantization-history.entity';
import { Wallet } from '../wallets/wallet.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionType } from '../wallets/transaction.entity';

@Injectable()
export class QuantizationService {
  private readonly logger = new Logger(QuantizationService.name);

  constructor(
    @InjectRepository(Quantization) private quantRepository: Repository<Quantization>,
    @InjectRepository(QuantizationHistory) private historyRepository: Repository<QuantizationHistory>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(UserLevel) private userLevelRepository: Repository<UserLevel>,
    @InjectRepository(Level) private levelRepository: Repository<Level>,
    private walletsService: WalletsService,
  ) {}

  async startQuantization(userId: string) {
    const active = await this.quantRepository.findOne({
      where: { userId, status: QuantizationStatus.RUNNING },
    });
    if (active) {
      throw new BadRequestException('Quantization already in progress');
    }

    const userLevel = await this.userLevelRepository.findOne({
      where: { userId },
      relations: ['currentLevel'],
    });
    if (!userLevel) throw new BadRequestException('User level not found');

    const level = userLevel.currentLevel;
    if (!level) throw new BadRequestException('Level configuration not found');

    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const capital = Number(wallet.operatingCapital);
    if (capital <= 0) {
      throw new BadRequestException('No operating capital available');
    }

    // Check daily quantization limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCompleted = await this.quantRepository
      .createQueryBuilder('q')
      .where('q.user_id = :userId', { userId })
      .andWhere('q.status = :status', { status: QuantizationStatus.COMPLETED })
      .andWhere('q.completed_at >= :today', { today })
      .getCount();

    if (todayCompleted >= level.quantizationsPerDay) {
      throw new BadRequestException(`Daily quantization limit reached (${level.quantizationsPerDay})`);
    }

    const dailyYield = capital * (Number(level.dailyYieldPercent) / 100);
    const expectedReturn = dailyYield;

    const quantization = this.quantRepository.create({
      userId,
      walletId: wallet.id,
      levelId: level.id,
      amountInvested: capital,
      expectedReturn,
      dailyYield: dailyYield,
      status: QuantizationStatus.RUNNING,
      startedAt: new Date(),
    });
    await this.quantRepository.save(quantization);

    const oldBalance = Number(wallet.availableBalance);
    wallet.availableBalance = oldBalance - capital;
    wallet.operatingCapital = capital;
    await this.walletRepository.save(wallet);

    this.logger.log(`Quantization started for user ${userId}: ${capital} USDT at ${level.dailyYieldPercent}%`);
    return quantization;
  }

  async completeQuantization(quantizationId: string) {
    const quant = await this.quantRepository.findOne({ where: { id: quantizationId } });
    if (!quant || quant.status !== QuantizationStatus.RUNNING) {
      throw new BadRequestException('Invalid quantization');
    }

    const durationMs = Date.now() - quant.startedAt.getTime();
    const durationSeconds = Math.floor(durationMs / 1000);
    const actualReturn = Number(quant.expectedReturn);

    quant.status = QuantizationStatus.COMPLETED;
    quant.actualReturn = actualReturn;
    quant.completedAt = new Date();
    quant.durationSeconds = durationSeconds;
    await this.quantRepository.save(quant);

    await this.historyRepository.save({
      quantizationId: quant.id,
      userId: quant.userId,
      cycleNumber: 1,
      amount: Number(quant.amountInvested),
      returnAmount: actualReturn,
      yieldPercent: Number(quant.dailyYield) / Number(quant.amountInvested) * 100,
      status: QuantizationStatus.COMPLETED,
      completedAt: new Date(),
    });

    const wallet = await this.walletRepository.findOne({ where: { id: quant.walletId } });
    if (wallet) {
      const oldBalance = Number(wallet.totalBalance);
      wallet.totalBalance = oldBalance + actualReturn;
      wallet.availableBalance = Number(wallet.availableBalance) + Number(quant.amountInvested) + actualReturn;
      wallet.totalEarned = Number(wallet.totalEarned) + actualReturn;
      await this.walletRepository.save(wallet);

      await this.walletsService.addTransaction({
        userId: quant.userId,
        walletId: wallet.id,
        type: TransactionType.QUANTIZATION_EARNING,
        amount: actualReturn,
        balanceBefore: oldBalance,
        balanceAfter: Number(wallet.totalBalance),
        referenceType: 'quantization',
        referenceId: quant.id,
        description: `Quantization earning: ${actualReturn.toFixed(4)} USDT`,
        metadata: { amountInvested: quant.amountInvested, yieldPercent: quant.dailyYield },
      });
    }

    this.logger.log(`Quantization completed for user ${quant.userId}: earned ${actualReturn} USDT`);
    return quant;
  }

  async getStatus(userId: string) {
    const active = await this.quantRepository.findOne({
      where: { userId, status: QuantizationStatus.RUNNING },
    });

    const completed = await this.quantRepository.find({
      where: { userId, status: QuantizationStatus.COMPLETED },
      order: { completedAt: 'DESC' },
      take: 20,
    });

    const totalEarned = completed.reduce((sum, q) => sum + Number(q.actualReturn || 0), 0);

    return {
      active,
      completed: completed.length,
      history: completed,
      totalEarned,
      nextQuantizationAt: active?.completedAt || null,
    };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async processQuantizations() {
    const running = await this.quantRepository.find({
      where: { status: QuantizationStatus.RUNNING },
    });

    for (const quant of running) {
      const elapsed = Date.now() - quant.startedAt.getTime();
      if (elapsed >= 120000) {
        try {
          await this.completeQuantization(quant.id);
        } catch (err) {
          this.logger.error(`Failed to complete quantization ${quant.id}: ${err.message}`);
        }
      }
    }
  }
}
