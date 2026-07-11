import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletAddress, WalletChain } from './wallet-address.entity';
import { Transaction, TransactionType } from './transaction.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletAddress) private addressRepository: Repository<WalletAddress>,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
  ) {}

  async getBalance(userId: string) {
    const wallet = await this.walletRepository.findOne({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async getTransactions(userId: string, page = 1, limit = 20, filters?: any) {
    const query = this.transactionRepository.createQueryBuilder('tx')
      .where('tx.user_id = :userId', { userId })
      .orderBy('tx.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (filters?.type) {
      query.andWhere('tx.type = :type', { type: filters.type });
    }
    if (filters?.from) {
      query.andWhere('tx.created_at >= :from', { from: filters.from });
    }
    if (filters?.to) {
      query.andWhere('tx.created_at <= :to', { to: filters.to });
    }

    const [transactions, total] = await query.getManyAndCount();
    return { transactions, total, page, limit };
  }

  async getAddresses(userId: string) {
    return this.addressRepository.find({ where: { userId } });
  }

  async generateAddress(userId: string, chain: WalletChain) {
    // In production, this would call a blockchain API to generate a deposit address
    // For now, generate a placeholder
    const existing = await this.addressRepository.findOne({ where: { userId, chain } });
    if (existing) return existing;

    const address = this.addressRepository.create({
      userId,
      chain,
      address: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      isDefault: true,
    });
    return this.addressRepository.save(address);
  }

  async addTransaction(data: {
    userId: string;
    walletId: string;
    type: TransactionType;
    amount: number;
    fee?: number;
    balanceBefore: number;
    balanceAfter: number;
    referenceType?: string;
    referenceId?: string;
    description?: string;
    metadata?: any;
  }) {
    const tx = this.transactionRepository.create(data);
    return this.transactionRepository.save(tx);
  }
}
