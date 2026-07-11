import { User } from '../users/user.entity';
export declare enum WalletChain {
    TRC20 = "TRC20",
    BEP20 = "BEP20",
    ERC20 = "ERC20",
    POLYGON = "POLYGON",
    ARBITRUM = "ARBITRUM",
    SOLANA = "SOLANA"
}
export declare class WalletAddress {
    id: string;
    userId: string;
    user: User;
    chain: WalletChain;
    address: string;
    label: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
