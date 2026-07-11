export declare class SecurityService {
    getSecurityInfo(): {
        encryption: string;
        hashing: string;
        authentication: string;
        twoFactor: string;
        rateLimiting: string;
        sessionManagement: string;
        auditLogging: string;
    };
}
