import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from './../../shared/shared.module';
import { PartnerController } from './partner.controller';
import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [PartnerController],
  imports: [SharedModule, AuthModule, HttpModule],
  providers: [PartnerService],
})
export class PartnerModule {}
