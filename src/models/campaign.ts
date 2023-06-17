import { ObjectId } from 'mongoose';
import { BaseEntity } from './base-entity';
import { TypeIndustry } from './partner';

export class Campaign extends BaseEntity {
  name!: string;
  numberVoucher!: number;
  discountDefined!: DiscountPercent[];
  campaignImage: string;
  type: TypeIndustry;
  games: Game[];
  description?: string;
  status: CampaignState;
  reasonRejected?: string;
  startDate!: Date;
  endDate!: Date;
}
// const test =
// {
//   "name":"Shoppe Sinh Nhật",
//   "numberVoucher":1000,
//   "discountDefined":[{
//     "amount":"500",
//     "discountPercent":"50"
//   },{
//     "amount":"500",
//     "discountPercent":"30"
//   }],
//   "description":"Chien dich ",
//   "startDate":"2023-01-01T 00:00:00",
//   "endDate":"2023-06-01T 00:00:00"

// }
export enum CampaignState {
  Pending = 'Pending',
  Ended = 'Ended',
  Rejected = 'Rejected',
  Running = 'Running',
}

export enum Game {
  Bird = 'Bird',
  TicTacToe = 'TicTacToe',
}

export class DiscountPercent {
  amount: number;
  discountPercent: number;
}
