import { ObjectId } from 'mongoose';
import { BaseEntity } from './base-entity';

export class Voucher extends BaseEntity {
  name!: string;
  idCampaign!: ObjectId;
  voucherImage: string;
  startDate!: Date;
  endDate!: Date;
}
