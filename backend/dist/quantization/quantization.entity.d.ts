import { User } from '../users/user.entity';
export declare enum QuantizationStatus {
    IDLE = "idle",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Quantization {
    id: string;
    userId: string;
    user: User;
    walletId: string;
    levelId: string;
    amountInvested: number;
    expectedReturn: number;
    actualReturn: number;
    dailyYield: number;
    status: QuantizationStatus;
    startedAt: Date;
    completedAt: Date;
    durationSeconds: number;
    createdAt: Date;
    updatedAt: Date;
}
