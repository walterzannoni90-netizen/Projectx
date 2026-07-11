import { Repository } from 'typeorm';
import { Deposit } from './deposit.entity';
import { Wallet } from '../wallets/wallet.entity';
import { WalletsService } from '../wallets/wallets.service';
export declare class DepositsService {
    private depositRepository;
    private walletRepository;
    private walletsService;
    constructor(depositRepository: Repository<Deposit>, walletRepository: Repository<Wallet>, walletsService: WalletsService);
    create(data: Partial<Deposit>): Promise<Deposit>;
    getUserDeposits(userId: string): Promise<Deposit[]>;
    confirmDeposit(depositId: string): Promise<Deposit>;
}
