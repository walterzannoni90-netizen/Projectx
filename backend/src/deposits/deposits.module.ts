import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositsController } from './deposits.controller';
import { DepositsService } from './deposits.service';
import { Deposit } from './deposit.entity';
import { Wallet } from '../wallets/wallet.entity';
import { Transaction } from '../wallets/transaction.entity';
import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Deposit, Wallet, Transaction]), WalletsModule],
  controllers: [DepositsController],
  providers: [DepositsService],
})
export class DepositsModule {}
