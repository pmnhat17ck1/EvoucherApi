import { ObjectId } from 'mongodb';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from './../../services/common.service';
import { CommonQueryService } from './../../services/common.query.service';
import { Injectable } from '@nestjs/common';
import { Partner } from 'src/models/partner';
import { DocName } from 'src/models/doc-name';

@Injectable()
export class PartnerService {
  constructor(
    private commonQueryService: CommonQueryService,
    private commonService: CommonService,
    private authService: AuthService,
  ) {}

  async createPartner(userId: ObjectId, request: Partner) {
    const now = this.commonService.getDate();

    const newPartner = {
      ...request,
      createdAt: now,
      createdUserId: userId,
    };

    const { insertedId } = await this.commonQueryService.insertOne(
      now,
      DocName.Partner,
      newPartner,
    );
    return { insertedId };
  }
}
