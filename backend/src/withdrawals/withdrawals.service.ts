import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Withdrawal, TransactionStatus } from './withdrawal.entity';
import { Wallet } from '../wallets/wallet.entity';
import { User } from '../users/user.entity';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionType } from '../wallets/transaction.entity';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawal) private withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private walletsService: WalletsService,
  ) {}

  async request(userId: string, data: {
    amount: number;
    chain: string;
    toAddress: string;
    pin: string;
  }) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Verify PIN
    const bcrypt = require('bcrypt');
    if (!user.pinHash || !(await bcrypt.compare(data.pin, user.pinHash))) {
      throw new BadRequestException('Invalid PIN');
    }

    // Check minimum withdrawal
    if (data.amount < 30) {
      throw new BadRequestException('Minimum withdrawal is 30 USDT');
    }

    // Check cooldown (48h between withdrawals)
    const lastWithdrawal = await this.withdrawalRepository.findOne({
      where: { userId, status: TransactionStatus.COMPLETED },
      order: { createdAt: 'DESC' },
    });
    if (lastWithdrawal) {
      const hoursSinceLast = (Date.now() - lastWithdrawal.createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLast < 48) {
        throw new BadRequestException(`Please wait ${Math.ceil(48 - hoursSinceLast)} hours before next withdrawal`);
      }
    }

    // Check balance (with fee)
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const userLevel = await this.userRepository.manager.getRepository('UserLevel').findOne({
      where: { userId },
      relations: ['currentLevel'],
    });
    const feePercent = userLevel?.currentLevel?.withdrawalFeePercent || 15;
    const fee = data.amount * (feePercent / 100);
    const totalDeduction = data.amount + fee;

    if (Number(wallet.availableBalance) < totalDeduction) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create withdrawal
    const withdrawal = this.withdrawalRepository.create({
      userId,
      walletId: wallet.id,
      chain: data.chain as any,
      toAddress: data.toAddress,
      amount: data.amount,
      feePercent,
      fee,
      pinVerified: true,
      pinVerifiedAt: new Date(),
      status: TransactionStatus.PENDING,
      amountUsd: data.amount,
    });
    await this.withdrawalRepository.save(withdrawal);

    // Deduct from wallet
    const oldBalance = Number(wallet.availableBalance);
    wallet.availableBalance = oldBalance - totalDeduction;
    wallet.totalBalance = Number(wallet.totalBalance) - totalDeduction;
    wallet.totalFees = Number(wallet.totalFees) + fee;
    await this.walletRepository.save(wallet);

    // Record transaction
    await this.walletsService.addTransaction({
      userId,
      walletId: wallet.id,
      type: TransactionType.WITHDRAWAL,
      amount: data.amount,
      fee,
      balanceBefore: oldBalance,
      balanceAfter: Number(wallet.availableBalance),
      referenceType: 'withdrawal',
      referenceId: withdrawal.id,
      description: `Withdrawal of ${data.amount} USDT to ${data.toAddress}`,
    });

    return withdrawal;
  }

  async getUserWithdrawals(userId: string) {
    return this.withdrawalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async approveByAdmin(withdrawalId: string, adminId: string) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');

    withdrawal.status = TransactionStatus.PROCESSING;
    withdrawal.adminApprovedBy = adminId;
    withdrawal.adminApprovedAt = new Date();
    return this.withdrawalRepository.save(withdrawal);
  }

  async complete(withdrawalId: string, txHash: string) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');

    withdrawal.status = TransactionStatus.COMPLETED;
    withdrawal.txHash = txHash;
    withdrawal.completedAt = new Date();

    const wallet = await this.walletRepository.findOne({ where: { id: withdrawal.walletId } });
    if (wallet) {
      wallet.totalWithdrawn = Number(wallet.totalWithdrawn) + Number(withdrawal.amount);
      await this.walletRepository.save(wallet);
    }

    return this.withdrawalRepository.save(withdrawal);
  }

  async reject(withdrawalId: string, reason: string) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id: withdrawalId } });
    if (!withdrawal) throw new NotFoundException('Withdrawal not found');

    withdrawal.status = TransactionStatus.CANCELLED;
    withdrawal.rejectionReason = reason;

    // Refund to wallet
    const wallet = await this.walletRepository.findOne({ where: { id: withdrawal.walletId } });
    if (wallet) {
      const totalDeduction = Number(withdrawal.amount) + Number(withdrawal.fee);
      wallet.availableBalance = Number(wallet.availableBalance) + totalDeduction;
      wallet.totalBalance = Number(wallet.totalBalance) + totalDeduction;
      await this.walletRepository.save(wallet);
    }

    return this.withdrawalRepository.save(withdrawal);
  }
}
