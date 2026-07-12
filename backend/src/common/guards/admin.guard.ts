import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const email = String(request.user?.email || '').toLowerCase();
    const allowed = String(this.config.get('ADMIN_EMAILS') || '')
      .split(',')
      .map(value => value.trim().toLowerCase())
      .filter(Boolean);

    if (!email || !allowed.includes(email)) {
      throw new ForbiddenException('Administrator access required');
    }
    return true;
  }
}
