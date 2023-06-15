import { Controller, Get } from '@nestjs/common';
import * as moment from 'moment-timezone';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  hi() {
    const now = moment();
    const localDate = moment(now).format('YYYY-MM-DD HH:mm:ss');
    const result = {
      message: 'Hi, there!',
      now: localDate,
    };
    return result;
  }
}
