import { User } from '../users/user.entity';
import { Quantization } from './quantization.entity';
export declare enum QuantizationStatus {
    IDLE = "idle",
    RUNNING = "running",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class QuantizationHistory {
    id: string;
    quantizationId: string;
    quantization: Quantization;
    userId: string;
    user: User;
    cycleNumber: number;
    amount: number;
    returnAmount: number;
    yieldPercent: number;
    status: QuantizationStatus;
    completedAt: Date;
    metadata: any;
    createdAt: Date;
}
