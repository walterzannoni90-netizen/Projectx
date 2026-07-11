import { WalletsService } from './wallets.service';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    getBalance(userId: string): Promise<import("./wallet.entity").Wallet>;
    getTransactions(userId: string, page?: number, limit?: number, type?: string): Promise<{
        transactions: import("./transaction.entity").Transaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAddresses(userId: string): Promise<import("./wallet-address.entity").WalletAddress[]>;
    generateAddress(userId: string, chain: any): Promise<import("./wallet-address.entity").WalletAddress>;
}
