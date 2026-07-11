import { Repository } from 'typeorm';
import { Quantization } from './quantization.entity';
import { QuantizationHistory } from './quantization-history.entity';
import { Wallet } from '../wallets/wallet.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { WalletsService } from '../wallets/wallets.service';
export declare class QuantizationService {
    private quantRepository;
    private historyRepository;
    private walletRepository;
    private userLevelRepository;
    private levelRepository;
    private walletsService;
    private readonly logger;
    constructor(quantRepository: Repository<Quantization>, historyRepository: Repository<QuantizationHistory>, walletRepository: Repository<Wallet>, userLevelRepository: Repository<UserLevel>, levelRepository: Repository<Level>, walletsService: WalletsService);
    startQuantization(userId: string): Promise<Quantization>;
    completeQuantization(quantizationId: string): Promise<Quantization>;
    getStatus(userId: string): Promise<{
        active: Quantization | null;
        completed: number;
        history: Quantization[];
        totalEarned: number;
        nextQuantizationAt: Date | null;
    }>;
    processQuantizations(): Promise<void>;
}
