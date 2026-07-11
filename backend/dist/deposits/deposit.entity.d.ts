import { User } from '../users/user.entity';
export declare enum TransactionStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export declare enum WalletChain {
    TRC20 = "TRC20",
    BEP20 = "BEP20",
    ERC20 = "ERC20",
    POLYGON = "POLYGON",
    ARBITRUM = "ARBITRUM",
    SOLANA = "SOLANA"
}
export declare class Deposit {
    id: string;
    userId: string;
    user: User;
    walletId: string;
    chain: WalletChain;
    txHash: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    amountUsd: number;
    fee: number;
    confirmations: number;
    requiredConfirmations: number;
    status: TransactionStatus;
    completedAt: Date;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;
}
