import { BaseEntity, BaseUserEntity } from './base-entity';

export class Partner extends BaseUserEntity {
  username!: string;
  displayName!: string;
  logoBrand: string;
  numberStore: number;
  lastLoginAt?: Date;
}
