import { CommonQueryService } from './common.query.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

import * as moment from 'moment-timezone';

@Injectable()
export class CommonService {
  constructor(private configService: ConfigService) {}

  getDateMoment() {
    const configNow = this.configService.get<string>('NOW');

    return moment();
  }

  getDate() {
    const now = this.getDateMoment().toDate();
    return now;
  }
}
