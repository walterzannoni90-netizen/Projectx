import { SecurityService } from './security.service';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    getSecurityInfo(): Promise<{
        encryption: string;
        hashing: string;
        authentication: string;
        twoFactor: string;
        rateLimiting: string;
        sessionManagement: string;
        auditLogging: string;
    }>;
}
