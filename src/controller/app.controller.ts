import { Controller, Get, Param, Res } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { Response } from 'express';
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
  @Get('uploads/campaigns/:filename')
  async getImagesCampaigns(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/campaigns' });
  }
  @Get('uploads/logos/:filename')
  async getImagesLogo(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/logos' });
  }
}
