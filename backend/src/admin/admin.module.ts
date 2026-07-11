import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/user.entity';
import { Profile } from '../users/profile.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Deposit } from '../deposits/deposit.entity';
import { Withdrawal } from '../withdrawals/withdrawal.entity';
import { Transaction } from '../wallets/transaction.entity';
import { Quantization } from '../quantization/quantization.entity';
import { Referral } from '../referral/referral.entity';
import { UserLevel } from '../levels/user-level.entity';
import { Level } from '../levels/level.entity';
import { Notification } from '../notifications/notification.entity';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User, Profile, Wallet, Deposit, Withdrawal, Transaction,
      Quantization, Referral, UserLevel, Level, Notification,
    ]),
    WithdrawalsModule,
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
