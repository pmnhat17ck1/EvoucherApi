import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from './../../shared/shared.module';
import { PartnerController } from './partner.controller';
import { Module } from '@nestjs/common';
import { PartnerService } from './partner.service';

@Module({
  controllers: [PartnerController],
  imports: [SharedModule, AuthModule],
  providers: [PartnerService],
})
export class PartnerModule {}
