import { ObjectId } from 'mongodb';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from './../../services/common.service';
import { CommonQueryService } from './../../services/common.query.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Partner } from 'src/models/partner';
import { DocName } from 'src/models/doc-name';
import { Role, User } from 'src/models/user';
import { getHash } from 'src/helpers/auth.helper';

@Injectable()
export class PartnerService {
  constructor(
    private commonQueryService: CommonQueryService,
    private commonService: CommonService,
    private authService: AuthService,
  ) {}

  async createPartner(userId: ObjectId, request) {
    const now = this.commonService.getDate();
    const hashedPassword = getHash(request.password);

    const { username } = await this.getUserByUsername(request.username);

    if (username) {
      throw new ForbiddenException('Partner exists already');
    }

    const newUser: User = {
      username: request.username,
      hashedPassword,
      displayName: request.name,
      email: request.email,
      phoneNumber: request.phoneNumber,
      role: Role.Partner,
      confirmationCode: null,
      sendConfirmationCodeAt: null,
      forgotCode: null,
      sendForgotCodeAt: null,
      lastLoginAt: null,
    };

    const insert = await this.commonQueryService.insertOne(
      now,
      DocName.Users,
      newUser,
    );

    const newPartner = {
      userId: insert.insertedId,
      type: request.type,
      createdAt: now,
      createdUserId: userId,
    };

    const { insertedId } = await this.commonQueryService.insertOne(
      now,
      DocName.Partner,
      newPartner,
    );

    return { insertedId };
  }

  async insertNewUser(newUser: User) {
    const now = this.commonService.getDate();
    const result = await this.commonQueryService.insertOne(
      now,
      DocName.Users,
      newUser,
    );
    return result;
  }

  async getUserByUsername(username: string): Promise<User> {
    const conditions = { username: username };
    const options = {};
    const user = await this.commonQueryService.findOneByQuery<any>(
      DocName.Users,
      conditions,
      options,
    );
    return user;
  }
}
