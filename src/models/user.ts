import { ObjectId } from 'mongodb';
import {
  AccountStatus,
  BaseUserEntity,
  RegisterStatus,
  BaseEntity,
} from './base-entity';

export class User extends BaseUserEntity {
  username: string;
  displayName!: string;
  hashedPassword!: string;
  role: Role;
  email?: string;
  phoneNumber?: string;
  fbId?: string;
  fbEmail?: string;
  gId?: string;
  gEmail?: string;
  accountStatus?: AccountStatus;
  registerStatus?: RegisterStatus;
  confirmationCode?: string;
  sendConfirmationCodeAt?: Date;
  forgotCode?: string;
  sendForgotCodeAt?: Date;
  rfToken?: string;
  lastLoginAt?: Date;
}

export enum Role {
  Admin = 'Admin',
  Partner = 'Partner',
  Client = 'Client',
}
