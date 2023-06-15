import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { compareHash, getHash } from 'src/helpers/auth.helper';
import { BaseUserEntity } from 'src/models/base-entity';
import { DocName } from 'src/models/doc-name';
import { User } from 'src/models/user';
import { CommonQueryService } from 'src/services/common.query.service';
import { CommonService } from 'src/services/common.service';

@Injectable()
export class UsersService {
  constructor(
    private commonService: CommonService,
    private commonQueryService: CommonQueryService,
  ) {}

  async getUsersByQuery<T>(
    conditions: any,
    projection: { [field: string]: number },
    docName: DocName,
  ) {
    const options = { projection };
    const users = await this.commonQueryService.findManyByQuery<T>(
      docName,
      conditions,
      options,
    );
    return users;
  }
  async vaildateUser(username: string, password: string): Promise<User> {
    const _user: any = await this.getUserByUsername(username, DocName.Users);
    if (!_user) {
      return null;
    }
    const comparePassword = await compareHash(password, _user.hashedPassword);
    if (!comparePassword) {
      return null;
    }
    return _user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: ObjectId) {
    const user = await this.getUserById<User>(userId);
    if (user.rfToken === refreshToken) {
      return user;
    }
    return null;
  }
  async getUserById<T>(userId: ObjectId) {
    const conditions = { _id: userId };
    const options = {};
    const user = await this.commonQueryService.findOneById<T>(
      DocName.Users,
      conditions,
      options,
    );
    return user;
  }

  async getUserByUsername<T>(username: string, docName: DocName) {
    const conditions = {
      username,
    };
    const options = {};
    const user = await this.commonQueryService.findOneByQuery<T>(
      docName,
      conditions,
      options,
    );
    return user;
  }

  async getUserByEmail<T>(
    email: string,
    projection: { [field: string]: number },
    docName: DocName,
  ) {
    const conditions = {
      email,
    };
    const options = { projection };
    const user = await this.commonQueryService.findOneByQuery<T>(
      docName,
      conditions,
      options,
    );
    return user;
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: ObjectId,
    docName: DocName,
  ) {
    const now = this.commonService.getDate();
    const currentHashedRefreshToken = getHash(refreshToken);
    const conditions = { _id: userId };
    const update = {
      $set: {
        currentHashedRefreshToken,
      },
    };
    const result = await this.commonQueryService.updateOneById(
      now,
      docName,
      conditions,
      update,
    );
    return result;
  }
}
