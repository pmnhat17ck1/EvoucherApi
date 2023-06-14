import { CommonService } from 'src/services/common.service';
import { AppService } from './../app.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from '../controller/user/user.module';
import { TransactionModule } from '../controller/transaction/transaction.module';
import { GameModule } from '../controller/game/game.module';
import { VoucherModule } from '../controller/voucher/voucher.module';
import { PartnerModule } from '../controller/partner/partner.module';
import { CampaignModule } from '../controller/campaign/campaign.module';
import { DbService } from 'src/services/db.service';
import { CommonQueryService } from 'src/services/common.query.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TransactionModule,
    UserModule,
    GameModule,
    PartnerModule,
    CampaignModule,
    VoucherModule,
    AppModule,
  ],
  controllers: [AppController],
  providers: [AppService, DbService, CommonQueryService, CommonService],
})
export class AppModule {}
