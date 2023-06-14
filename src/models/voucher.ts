import { ObjectId } from 'mongoose';
import { BaseEntity } from './base-entity';

export class Voucher extends BaseEntity {
  name!: string;
  idCampaign!: ObjectId;
  startDate!: Date;
  endDate!: Date;
}
