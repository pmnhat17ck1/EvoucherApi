import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { getUserId } from 'src/helpers/common.helper';
import { PartnerService } from './partner.service';

@Controller('partner')
export class PartnerController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private partnerService: PartnerService) {}

  @Post()
  async addPartner(@Req() req: Request, @Body() body) {
    const userId = getUserId(req);
    const partner = await this.partnerService.createPartner(userId, body);
    return partner;
  }
  @Post('/:id')
  async addBranch(@Param('id') id: ObjectId) {
    console.log(id);
    return '';
  }
}
