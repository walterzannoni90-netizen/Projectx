import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Deposit } from '../deposits/deposit.entity';
import { Withdrawal } from '../withdrawals/withdrawal.entity';
import { Transaction } from '../wallets/transaction.entity';
import { Quantization } from '../quantization/quantization.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(Deposit) private depositRepository: Repository<Deposit>,
    @InjectRepository(Withdrawal) private withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
    @InjectRepository(Quantization) private quantizationRepository: Repository<Quantization>,
    @InjectRepository(UserLevel) private userLevelRepository: Repository<UserLevel>,
    @InjectRepository(Level) private levelRepository: Repository<Level>,
    private withdrawalsService: WithdrawalsService,
  ) {}

  async getDashboard() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { status: 'active' as any } });
    const totalDeposits = await this.depositRepository
      .createQueryBuilder('d')
      .select('COALESCE(SUM(d.amount), 0)', 'total')
      .where('d.status = :status', { status: 'completed' })
      .getRawOne();
    const totalWithdrawals = await this.withdrawalRepository
      .createQueryBuilder('w')
      .select('COALESCE(SUM(w.amount), 0)', 'total')
      .where('w.status = :status', { status: 'completed' })
      .getRawOne();
    const pendingWithdrawals = await this.withdrawalRepository.count({
      where: { status: 'pending' as any },
    });
    const pendingDeposits = await this.depositRepository.count({
      where: { status: 'pending' as any },
    });

    const totalFees = await this.transactionRepository
      .createQueryBuilder('t')
      .select('COALESCE(SUM(t.fee), 0)', 'total')
      .getRawOne();

    return {
      totalUsers,
      activeUsers,
      totalDeposits: Number(totalDeposits?.total || 0),
      totalWithdrawals: Number(totalWithdrawals?.total || 0),
      pendingWithdrawals,
      pendingDeposits,
      totalFees: Number(totalFees?.total || 0),
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const query = this.userRepository.createQueryBuilder('u')
      .leftJoinAndSelect('u.wallet', 'wallet')
      .leftJoinAndSelect('u.userLevels', 'userLevel')
      .orderBy('u.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      query.where('u.email ILIKE :search OR u.nickname ILIKE :search', { search: `%${search}%` });
    }

    const [users, total] = await query.getManyAndCount();
    return { users, total, page, limit };
  }

  async getUserDetail(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile', 'wallet', 'userLevels', 'userLevels.currentLevel'],
    });
    if (!user) throw new NotFoundException('User not found');

    const deposits = await this.depositRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    const withdrawals = await this.withdrawalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    const quantizations = await this.quantizationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return { user, deposits, withdrawals, quantizations };
  }

  async updateUserStatus(userId: string, status: string) {
    return this.userRepository.update(userId, { status: status as any });
  }

  async approveWithdrawal(withdrawalId: string, adminId: string) {
    return this.withdrawalsService.approveByAdmin(withdrawalId, adminId);
  }

  async completeWithdrawal(withdrawalId: string, txHash: string) {
    return this.withdrawalsService.complete(withdrawalId, txHash);
  }

  async rejectWithdrawal(withdrawalId: string, reason: string) {
    return this.withdrawalsService.reject(withdrawalId, reason);
  }

  async getPendingWithdrawals() {
    return this.withdrawalRepository.find({
      where: { status: 'pending' as any },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async getSystemStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const newUsersToday = await this.userRepository
      .createQueryBuilder('u')
      .where('u.created_at >= :today', { today })
      .getCount();

    const newUsersThisMonth = await this.userRepository
      .createQueryBuilder('u')
      .where('u.created_at >= :month', { month: thisMonth })
      .getCount();

    return {
      newUsersToday,
      newUsersThisMonth,
    };
  }

  async getAuditLogs(page = 1, limit = 50) {
    const repo = this.userRepository.manager.getRepository('AuditLog');
    const [logs, total] = await repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { logs, total, page, limit };
  }
}
