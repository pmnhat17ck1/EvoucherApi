import { CampaignService } from './campaign.service';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from './../../shared/shared.module';
import { CampaignController } from './campaign.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CampaignController],
  imports: [SharedModule, AuthModule],
  providers: [CampaignService],
  exports: [CampaignService],
})
export class CampaignModule {}
