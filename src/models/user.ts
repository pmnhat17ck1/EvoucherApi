import { AccountStatus, BaseUserEntity, RegisterStatus } from './base-entity';

export class User extends BaseUserEntity {
  username: string;
  displayName!: string;
  hashedPassword!: string;
  email?: string;
  phoneNumber?: string;
  fbId?: string;
  fbEmail?: string;
  gId?: string;
  gEmail?: string;
  accountStatus: AccountStatus;
  registerStatus: RegisterStatus;
  confirmationCode?: string;
  sendConfirmationCodeAt?: Date;
  forgotCode?: string;
  sendForgotCodeAt?: Date;
  rfToken?: string;
  lastLoginAt?: Date;
}
