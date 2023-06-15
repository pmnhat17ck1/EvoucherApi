import { ObjectId } from 'mongoose';

export class BaseEntity {
  _id?: ObjectId;
  createdAt?: Date;
  createdUserId?: ObjectId;
  modifiedAt?: Date;
  modifiedUserId?: ObjectId;
}

export enum AccountStatus {
  Enabled = 'Enabled',
  Disabled = 'Disabled',
}

export enum RegisterStatus {
  ThirdPartyLoginLinked = 'ThirdPartyLoginLinked',
  WaitingEmailConfirmation = 'WaitingEmailConfirmation',
  EmailConfirmed = 'EmailConfirmed',
  LoggedInSystem = 'LoggedInSystem',
}
export class BaseUserEntity extends BaseEntity {
  hashedPassword?: string;
  currentHashedRefreshToken?: string;
  accountStatus?: AccountStatus;
}
