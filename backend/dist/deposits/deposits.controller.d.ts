import { DepositsService } from './deposits.service';
export declare class DepositsController {
    private readonly depositsService;
    constructor(depositsService: DepositsService);
    getUserDeposits(userId: string): Promise<import("./deposit.entity").Deposit[]>;
    createDeposit(userId: string, data: any): Promise<import("./deposit.entity").Deposit>;
}
