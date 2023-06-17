import { TypeIndustry } from './../../models/partner';
import { PagingQuery } from './../../models/pagination';
import { PartnerAccessAuthGuard } from './../../auth/partner.strategy';
import {
  fileFilter,
  getUserId,
  setNameImageCampaign,
} from 'src/helpers/common.helper';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongodb';
import { CampaignService } from './campaign.service';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

@UseGuards(PartnerAccessAuthGuard)
@Controller('campaign')
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get()
  async getAllCampaigns(@Req() req: Request, @Query() query: PagingQuery) {
    return this.campaignService.getAllCampaigns(req.url, query);
  }

  @Get('/getByType/:type')
  async getCampaignsByType(
    @Req() req: Request,
    @Query() query: PagingQuery,
    @Param('type') type: TypeIndustry,
  ) {
    return this.campaignService.getCampaignByType(req.url, query, type);
  }

  @Get('/getByUserId')
  async getCampaignByUserId(@Req() req: Request, @Query() query: PagingQuery) {
    const userId = getUserId(req);
    return this.campaignService.getCampaignByUserId(req.url, query, userId);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('campaignImage', {
      storage: diskStorage({
        destination: './uploads/campaigns',
        filename: (req, file, cb) => setNameImageCampaign(req, file, cb),
      }),
      fileFilter: (req, file, cb) => fileFilter(req, file, cb),
    }),
  )
  async createCampaign(
    @Body() body,
    @Req() req: Request,
    @UploadedFile() campaignImage: Express.Multer.File,
  ) {
    if (!campaignImage) {
      throw new BadRequestException('File is not an image');
    }
    const userId = getUserId(req);
    console.log({ userId });
    body.campaignImage = campaignImage.filename;

    const campaign = await this.campaignService.createCampaign(userId, body);
    return { data: { _id: campaign.insertedId } };
  }

  @Put('/:id')
  async updateCampaign(
    @Req() req: Request,
    @Param('id') id: ObjectId,
    @Body() body,
  ) {
    const userId = getUserId(req);
    const { matchedCount } = await this.campaignService.updateCampaign(
      userId,
      body,
      id,
    );
    return { matchedCount };
  }

  @Put('/image/:id')
  @UseInterceptors(
    FileInterceptor('campaignImage', {
      storage: diskStorage({
        destination: './uploads/campaigns',
        filename: (req, file, cb) => setNameImageCampaign(req, file, cb),
      }),
      fileFilter: (req, file, cb) => fileFilter(req, file, cb),
    }),
  )
  async updateCampaignImage(
    @Req() req: Request,
    @Param('id') id: ObjectId,
    @UploadedFile() campaignImage: Express.Multer.File,
  ) {
    const userId = getUserId(req);
    if (!campaignImage) {
      throw new BadRequestException('File is not an image');
    }
    const { matchedCount } = await this.campaignService.updateCampaignImage(
      userId,
      id,
      campaignImage.filename,
    );
    return { matchedCount };
  }

  @Delete('/:id')
  async deleteCampaign(@Param('id') id: ObjectId) {
    const { deletedCount } = await this.campaignService.deleteCampaign(id);

    if (deletedCount !== 1) {
      throw new ForbiddenException('An unknown error');
    }
  }
}
