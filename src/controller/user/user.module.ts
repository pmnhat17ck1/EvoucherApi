import { ClientAccessStrategy } from '../../auth/client.strategy';
import { CommonService } from 'src/services/common.service';
import { Module } from '@nestjs/common';
import { CommonQueryService } from 'src/services/common.query.service';
import { SharedModule } from 'src/shared/shared.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [SharedModule, AuthModule],
  providers: [UserService, CommonQueryService, CommonService],
  exports: [UserService],
})
export class UserModule {}
