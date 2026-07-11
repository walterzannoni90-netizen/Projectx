import { QuantizationService } from './quantization.service';
export declare class QuantizationController {
    private readonly quantizationService;
    constructor(quantizationService: QuantizationService);
    start(userId: string): Promise<import("./quantization.entity").Quantization>;
    getStatus(userId: string): Promise<{
        active: import("./quantization.entity").Quantization | null;
        completed: number;
        history: import("./quantization.entity").Quantization[];
        totalEarned: number;
        nextQuantizationAt: Date | null;
    }>;
}
