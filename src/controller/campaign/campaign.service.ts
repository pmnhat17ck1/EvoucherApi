import { TypeIndustry } from './../../models/partner';
import { PagingQuery } from './../../models/pagination';
import { CommonQueryService } from './../../services/common.query.service';
import { Campaign, CampaignState } from './../../models/campaign';
import { ObjectId } from 'mongodb';
import { CommonService } from './../../services/common.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DocName } from 'src/models/doc-name';
import { Partner } from 'src/models/partner';

@Injectable()
export class CampaignService {
  constructor(
    private commonService: CommonService,
    private commonQueryService: CommonQueryService,
  ) {}

  async getAllCampaigns(url: string, query: PagingQuery) {
    return this.commonQueryService.findWithPaging(
      DocName.Campaign,
      {},
      url,
      query,
    );
  }

  async getCampaignByType(url: string, query: PagingQuery, type: TypeIndustry) {
    return this.commonQueryService.findWithPaging(
      DocName.Campaign,
      { type },
      url,
      query,
    );
  }

  async getCampaignByUserId(url: string, query: PagingQuery, userId: ObjectId) {
    return this.commonQueryService.findWithPaging(
      DocName.Campaign,
      { createdUserId: userId },
      url,
      query,
    );
  }

  async createCampaign(userId: ObjectId, request) {
    const now = this.commonService.getDate();

    const partner: Partner = await this.commonQueryService.findOneByQuery(
      DocName.Partner,
      { userId: new ObjectId(userId) },
    );

    const newCampaign: Campaign = {
      ...request,
      idBranch: new ObjectId(request.idBranch),
      status: CampaignState.Pending,
      type: partner.type,
      discountDefined: [],
      games: [],
      createdAt: now,
      createdUserId: userId,
    };

    const { insertedId } = await this.commonQueryService.insertOne(
      now,
      DocName.Campaign,
      newCampaign,
    );

    const { matchedCount } = await this.commonQueryService.updateOneById(
      now,
      DocName.Campaign,
      { _id: insertedId },
      {
        $set: {
          discountDefined: JSON.parse(request.discountDefined),
          games: JSON.parse(request.games),
        },
      },
    );

    return { insertedId };
  }

  async updateCampaign(userId: ObjectId, request, _id: ObjectId) {
    const now = this.commonService.getDate();

    const conditions = {
      _id,
    };
    const update = {
      $set: {
        ...request,
        modifiedUserId: userId,
      },
    };

    const campaign: Campaign = await this.commonQueryService.findOneById(
      DocName.Campaign,
      conditions,
    );

    if (campaign.status !== CampaignState.Pending) {
      throw new ForbiddenException('Cannot modify!');
    }

    const { matchedCount } = await this.commonQueryService.updateOneById(
      now,
      DocName.Campaign,
      conditions,
      update,
    );

    return { matchedCount };
  }

  async updateCampaignImage(
    userId: ObjectId,
    _id: ObjectId,
    imageName: string,
  ) {
    const now = this.commonService.getDate();

    const conditions = {
      _id,
    };

    const update = {
      $set: {
        campaignImage: imageName,
        modifiedUserId: userId,
      },
    };
    const { matchedCount } = await this.commonQueryService.updateOneById(
      now,
      DocName.Campaign,
      conditions,
      update,
    );

    return { matchedCount };
  }

  async deleteCampaign(_id: ObjectId) {
    const conditions = {
      _id,
    };

    const { deletedCount } = await this.commonQueryService.deleteOneById(
      DocName.Campaign,
      conditions,
    );

    return { deletedCount };
  }
}
