import { ObjectId } from 'mongoose';
import { BaseEntity } from './base-entity';

export class Transaction extends BaseEntity {
  idCampaign: ObjectId;
  totalFee: number;
  status: TransactionStatus;
}

enum TransactionStatus {
  Completed = 'Completed',
  Pending = 'Pending',
  Rejected = 'Rejected',
}
