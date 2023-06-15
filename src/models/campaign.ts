import { ObjectId } from 'mongoose';
import { BaseEntity } from './base-entity';

export class Campaign extends BaseEntity {
  name!: string;
  idPartner!: ObjectId;
  numberVoucher!: number;
  discountDefined!: DiscountPercent[];
  campaignImage: string;
  status: CampaignState;
  reasonRejected?: string;
  startDate!: Date;
  endDate!: Date;
}

enum CampaignState {
  Pending = 'Pending',
  Ended = 'Ended',
  Rejected = 'Rejected',
  Running = 'Running',
}

class DiscountPercent {
  number: number;
  discountPercent: number;
}
