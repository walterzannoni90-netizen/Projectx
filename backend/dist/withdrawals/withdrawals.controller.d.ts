import { WithdrawalsService } from './withdrawals.service';
export declare class WithdrawalsController {
    private readonly withdrawalsService;
    constructor(withdrawalsService: WithdrawalsService);
    getUserWithdrawals(userId: string): Promise<import("./withdrawal.entity").Withdrawal[]>;
    requestWithdrawal(userId: string, data: {
        amount: number;
        chain: string;
        toAddress: string;
        pin: string;
    }): Promise<import("./withdrawal.entity").Withdrawal>;
}
