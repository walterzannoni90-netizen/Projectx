import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletAddress, WalletChain } from './wallet-address.entity';
import { Transaction, TransactionType } from './transaction.entity';
export declare class WalletsService {
    private walletRepository;
    private addressRepository;
    private transactionRepository;
    constructor(walletRepository: Repository<Wallet>, addressRepository: Repository<WalletAddress>, transactionRepository: Repository<Transaction>);
    getBalance(userId: string): Promise<Wallet>;
    getTransactions(userId: string, page?: number, limit?: number, filters?: any): Promise<{
        transactions: Transaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAddresses(userId: string): Promise<WalletAddress[]>;
    generateAddress(userId: string, chain: WalletChain): Promise<WalletAddress>;
    addTransaction(data: {
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
    }): Promise<Transaction>;
}
