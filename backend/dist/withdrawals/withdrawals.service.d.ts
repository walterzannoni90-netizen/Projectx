import { Repository } from 'typeorm';
import { Withdrawal } from './withdrawal.entity';
import { Wallet } from '../wallets/wallet.entity';
import { User } from '../users/user.entity';
import { WalletsService } from '../wallets/wallets.service';
export declare class WithdrawalsService {
    private withdrawalRepository;
    private walletRepository;
    private userRepository;
    private walletsService;
    constructor(withdrawalRepository: Repository<Withdrawal>, walletRepository: Repository<Wallet>, userRepository: Repository<User>, walletsService: WalletsService);
    request(userId: string, data: {
        amount: number;
        chain: string;
        toAddress: string;
        pin: string;
    }): Promise<Withdrawal>;
    getUserWithdrawals(userId: string): Promise<Withdrawal[]>;
    approveByAdmin(withdrawalId: string, adminId: string): Promise<Withdrawal>;
    complete(withdrawalId: string, txHash: string): Promise<Withdrawal>;
    reject(withdrawalId: string, reason: string): Promise<Withdrawal>;
}
