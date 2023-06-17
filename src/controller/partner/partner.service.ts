import { isNullOrUndefined } from 'src/helpers/util.helper';
import { ObjectId } from 'mongodb';
import { AuthService } from 'src/auth/auth.service';
import { CommonService } from './../../services/common.service';
import { CommonQueryService } from './../../services/common.query.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Partner, Branch } from 'src/models/partner';
import { DocName } from 'src/models/doc-name';
import { Role, User } from 'src/models/user';
import { getHash } from 'src/helpers/auth.helper';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PartnerService {
  constructor(
    private commonQueryService: CommonQueryService,
    private commonService: CommonService,
    private httpService: HttpService,
  ) {}

  async createPartner(userId: ObjectId, request) {
    const now = this.commonService.getDate();
    const hashedPassword = getHash(request.password);

    const userCheck = await this.getUserByUsername(request.username);

    if (!isNullOrUndefined(userCheck)) {
      throw new ForbiddenException('Partner exists already!');
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
      name: request.name,
      logo: request.logo,
      type: request.type,
      createdUserId: new ObjectId(userId),
      createdAt: now,
    };

    const { insertedId } = await this.commonQueryService.insertOne(
      now,
      DocName.Partner,
      newPartner,
    );

    return { insertedId };
  }

  async createBranch(userId: ObjectId, request, _id: ObjectId) {
    const now = this.commonService.getDate();

    const geoCode = await this.httpService.axiosRef.get(
      `https://geocode.maps.co/search?q=${request.direction}`,
    );

    const newBranch: Branch = {
      _id: new ObjectId(),
      ...request,
      longtitude: geoCode.data[0].lon,
      latitude: geoCode.data[0].lat,
      createdAt: now,
      createdByUserId: <ObjectId>userId,
    };
    const conditions = { userId: new ObjectId(_id) };

    const update: any = {
      $push: { branches: newBranch },
    };

    const { matchedCount } = await this.commonQueryService.updateOneByQuery(
      now,
      DocName.Partner,
      conditions,
      update,
    );

    return { matchedCount, _id };
  }

  async modifyBranch(
    userId: ObjectId,
    request,
    _id: ObjectId,
    branchId: ObjectId,
  ) {
    const now = this.commonService.getDate();

    const conditions = {
      userId: new ObjectId(_id),
      branches: { $elemMatch: { _id: new ObjectId(branchId) } },
    };

    let update: any = {};
    if (isNullOrUndefined(request.direction)) {
      const geoCode = await this.httpService.axiosRef.get(
        `https://geocode.maps.co/search?q=${request.direction}`,
      );
      update = {
        $set: {
          'branches.$.nameBranch': request.nameBranch,
          'branches.$.description': request.description,
          'branches.$.direction': request.direction,
          'branches.$.longtitude': geoCode.data[0].lon,
          'branches.$.latitude': geoCode.data[0].lat,
          'branches.$.modifiedAt': now,
          'branches.$.modifiedUserId': <ObjectId>userId,
        },
      };
    } else {
      update = {
        $set: {
          'branches.$.nameBranch': request.nameBranch,
          'branches.$.description': request.description,
          'branches.$.direction': request.direction,
          'branches.$.modifiedAt': now,
          'branches.$.modifiedUserId': <ObjectId>userId,
        },
      };
    }

    const { matchedCount } = await this.commonQueryService.updateOneByQuery(
      now,
      DocName.Partner,
      conditions,
      update,
    );

    return { matchedCount, _id };
  }

  async removeBranch(_id: ObjectId, branchId: ObjectId) {
    const conditions = {
      userId: _id,
      branches: { $elemMatch: { _id: new ObjectId(branchId) } },
    };
    console.log(_id);
    console.log(conditions);
    // const { deletedCount } = await this.commonQueryService.deleteOneByQuery(
    //   DocName.Partner,
    //   conditions,
    // );
    const options = { projection: { 'branches.$': 1 } };
    console.log('first');
    const partner = await this.commonQueryService.findOneByQuery(
      DocName.Partner,
      conditions,
      options,
    );

    console.log(partner);

    return { deletedCount: 0 };
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
