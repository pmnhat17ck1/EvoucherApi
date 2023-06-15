import { Body, Controller, Post, Req } from '@nestjs/common';
import { getUserId } from 'src/helpers/common.helper';
import { PartnerService } from './partner.service';

@Controller('partner')
export class PartnerController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private partnerService: PartnerService) {}

  @Post()
  async addPartner(@Req() req: Request, @Body() body) {
    const userId = getUserId(req);
    console.log(userId);
    const partner = await this.partnerService.createPartner(userId, body);
  }
}
