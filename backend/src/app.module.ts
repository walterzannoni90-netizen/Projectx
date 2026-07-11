import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { DepositsModule } from './deposits/deposits.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { QuantizationModule } from './quantization/quantization.module';
import { ReferralModule } from './referral/referral.module';
import { LevelsModule } from './levels/levels.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { SecurityModule } from './security/security.module';

const useSQLite = process.env.USE_SQLITE === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (useSQLite) {
          console.log('📦 SQLite (dev fallback)');
          return {
            type: 'better-sqlite3',
            database: path.join(__dirname, '..', 'data', 'projectx.db'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            autoLoadEntities: true,
          };
        }
        console.log('🐘 PostgreSQL via Supabase Pooler');
        return {
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || '6543'),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE || 'postgres',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          ssl: { rejectUnauthorized: false },
          autoLoadEntities: true,
          extra: {
            max: 10,
            connectionTimeoutMillis: 10000,
          },
        };
      },
    }),

    ScheduleModule.forRoot(),
    AuthModule, UsersModule, WalletsModule, DepositsModule,
    WithdrawalsModule, QuantizationModule, ReferralModule,
    LevelsModule, NotificationsModule, AdminModule, SecurityModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
