import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { QuantizationController } from './quantization.controller';
import { QuantizationService } from './quantization.service';
import { Quantization } from './quantization.entity';
import { QuantizationHistory } from './quantization-history.entity';
import { Wallet } from '../wallets/wallet.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { User } from '../users/user.entity';
import { WalletsModule } from '../wallets/wallets.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quantization, QuantizationHistory, Wallet, UserLevel, Level, User]),
    WalletsModule,
    NotificationsModule,
  ],
  controllers: [QuantizationController],
  providers: [QuantizationService],
})
export class QuantizationModule {}
