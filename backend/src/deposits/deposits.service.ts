import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deposit, TransactionStatus } from './deposit.entity';
import { Wallet } from '../wallets/wallet.entity';
import { WalletsService } from '../wallets/wallets.service';
import { TransactionType } from '../wallets/transaction.entity';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit) private depositRepository: Repository<Deposit>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    private walletsService: WalletsService,
  ) {}

  async create(data: Partial<Deposit>) {
    const deposit = this.depositRepository.create(data);
    return this.depositRepository.save(deposit);
  }

  async getUserDeposits(userId: string) {
    return this.depositRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async confirmDeposit(depositId: string) {
    const deposit = await this.depositRepository.findOne({ where: { id: depositId } });
    if (!deposit) throw new NotFoundException('Deposit not found');

    deposit.status = TransactionStatus.COMPLETED;
    deposit.completedAt = new Date();
    deposit.confirmations = deposit.requiredConfirmations;
    await this.depositRepository.save(deposit);

    // Update wallet balance
    const wallet = await this.walletRepository.findOne({ where: { id: deposit.walletId } });
    if (wallet) {
      const oldBalance = wallet.totalBalance;
      wallet.totalBalance = Number(wallet.totalBalance) + Number(deposit.amount);
      wallet.availableBalance = Number(wallet.availableBalance) + Number(deposit.amount);
      wallet.totalDeposited = Number(wallet.totalDeposited) + Number(deposit.amount);
      await this.walletRepository.save(wallet);

      // Record transaction
      await this.walletsService.addTransaction({
        userId: deposit.userId,
        walletId: wallet.id,
        type: TransactionType.DEPOSIT,
        amount: Number(deposit.amount),
        balanceBefore: oldBalance,
        balanceAfter: Number(wallet.totalBalance),
        referenceType: 'deposit',
        referenceId: deposit.id,
        description: `Deposit of ${deposit.amount} USDT via ${deposit.chain}`,
      });
    }

    return deposit;
  }
}
