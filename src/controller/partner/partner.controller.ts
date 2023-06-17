import { PartnerAccessAuthGuard } from './../../auth/partner.strategy';
import { AdminAccessAuthGuard } from './../../auth/admin.strategy';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  ForbiddenException,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { fileFilter, getUserId, setNameImage } from 'src/helpers/common.helper';
import { PartnerService } from './partner.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@UseGuards(PartnerAccessAuthGuard)
@Controller('partner')
export class PartnerController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private partnerService: PartnerService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req, file, cb) => setNameImage(req, file, cb),
      }),
      fileFilter: (req, file, cb) => fileFilter(req, file, cb),
    }),
  )
  async addPartner(
    @Req() req: Request,
    @Body() body,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    if (!logo) {
      throw new BadRequestException('File is not an image');
    }
    const userId: ObjectId = getUserId(req);

    body.logo = `${logo.destination.replace(/\./g, '')}/${logo.filename}`;
    const partner = await this.partnerService.createPartner(userId, body);
    return { data: { _id: partner.insertedId } };
  }

  @Put('/addBranch')
  async addBranch(@Body() body, @Req() req: Request) {
    const userId = getUserId(req);
    const { matchedCount, _id } = await this.partnerService.createBranch(
      userId,
      body,
    );

    if (matchedCount !== 1) {
      throw new ForbiddenException('An unknown error');
    }
    return { data: { _id } };
  }

  @Put('/:id/:idBranch')
  async editBranch(
    @Param('id') id: ObjectId,
    @Param('idBranch') idBranch: ObjectId,
    @Body() body,
    @Req() req: Request,
  ) {
    const userId = getUserId(req);

    const { matchedCount, _id } = await this.partnerService.modifyBranch(
      userId,
      body,
      id,
      idBranch,
    );

    if (matchedCount !== 1) {
      throw new ForbiddenException('An unknown error');
    }
    return { data: { _id } };
  }

  @Delete('/:id/:idBranch')
  async removeBranch(
    @Param('id') id: ObjectId,
    @Param('idBranch') idBranch: ObjectId,
    @Body() body,
    @Req() req: Request,
  ) {
    const { deletedCount } = await this.partnerService.removeBranch(
      id,
      idBranch,
    );
    if (deletedCount !== 1) {
      throw new ForbiddenException('An unknown error');
    }
  }
}
