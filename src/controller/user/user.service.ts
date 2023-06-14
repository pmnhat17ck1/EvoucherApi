import { LoginRequest } from './../../models/requests/user.req';
import { User } from 'src/models/user';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { getHash } from 'src/helpers/auth.helper';
import { isNullOrUndefined } from 'src/helpers/util.helper';
import { AccountStatus, RegisterStatus } from 'src/models/base-entity';
import { DocName } from 'src/models/doc-name';
import { RegisterRequest } from 'src/models/requests/user.req';
import { CommonQueryService } from 'src/services/common.query.service';
import { CommonService } from 'src/services/common.service';
import { ObjectId } from 'mongodb';
import { compareHash } from '../../helpers/auth.helper';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UserService {
  constructor(
    private commonQueryService: CommonQueryService,
    private commonService: CommonService,
    private authService: AuthService,
  ) {}
  async register(user: RegisterRequest) {
    if (user.password !== user.confirmPassword) {
      throw new ForbiddenException('Failure to register');
    }

    const hashedPassword = getHash(user.password);
    const newUser: User = {
      username: user.username,
      hashedPassword,
      displayName: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      accountStatus: AccountStatus.Disabled,
      registerStatus: RegisterStatus.WaitingEmailConfirmation,
      confirmationCode: null,
      sendConfirmationCodeAt: null,
      forgotCode: null,
      sendForgotCodeAt: null,
      lastLoginAt: null,
    };
    const pendingConditions: any = {
      username: user.username,
      registerStatus: {
        $in: [
          RegisterStatus.ThirdPartyLoginLinked,
          RegisterStatus.WaitingEmailConfirmation,
        ],
      },
    };
    const pendingUser = await this.commonQueryService.findOneByQuery<User>(
      DocName.Users,
      pendingConditions,
      { projection: { _id: 1 } },
    );
    if (isNullOrUndefined(pendingUser)) {
      const { insertedId } = await this.insertNewUser(newUser);
      //   newUser._id = insertedId;
    }
    return newUser;
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

  async login(user: LoginRequest) {
    const _user = await this.getUserByUsername(user.username);
    if (!_user) {
      return { authentication: false, message: 'User not found!' };
    }
    const comparePassword = await compareHash(
      user.password,
      _user.hashedPassword,
    );
    if (!comparePassword) {
      return { authentication: false, message: 'Wrong password!' };
    }
    const payload: any = {
      _id: _user._id,
    };
    const token = await this.authService.getTokens(payload);
    await this.setRfTokenUser(_user._id, token.refreshToken);
    return {
      authentication: true,
      user: {
        name: _user.displayName,
        email: _user.email,
        phone: _user.phoneNumber,
      },
      accessToken: token.accessToken,
    };
  }
  async getAll() {
    return await this.commonQueryService.findManyByQuery(DocName.Users, {});
  }
  async setRfTokenUser(userId, rfToken: string) {
    const conditions = { _id: userId };
    const now = this.commonService.getDate();
    const update = {
      $set: {
        rfToken: rfToken,
      },
    };
    const updated = await this.commonQueryService.updateOneById(
      now,
      DocName.Users,
      conditions,
      update,
    );
    console.log({ updated });
    return updated;
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

  async getUserById(userId: ObjectId) {
    const conditions = { _id: userId };
    const options = {};
    const user = await this.commonQueryService.findOneById<any>(
      DocName.Users,
      conditions,
      options,
    );
    return user;
  }
}
