import { ObjectId } from 'mongoose';
import { BaseEntity } from './base-entity';

export class Campaign extends BaseEntity {
  name!: string;
  idPartner!: ObjectId;
  status: CampaignState;
  CampaignImage: string;
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
