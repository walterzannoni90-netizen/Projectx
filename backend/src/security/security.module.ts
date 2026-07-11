import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';

@Module({
  imports: [],
  controllers: [SecurityController],
  providers: [SecurityService],
})
export class SecurityModule {}
