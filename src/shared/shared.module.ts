import { CommonQueryService } from '../services/common.query.service';
import { Global, Module } from '@nestjs/common';
import { DbService } from 'src/services/db.service';
import { CommonService } from 'src/services/common.service';

@Global()
@Module({
  providers: [DbService, CommonQueryService, CommonService],
  exports: [DbService, CommonQueryService, CommonService],
})
export class SharedModule {}
