import { isNullOrUndefined } from 'src/helpers/util.helper';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { getRefreshToken } from 'src/helpers/common.helper';
import { UsersService } from './user.service';
import { User } from '../models/user';
import { Role } from '../models/user';

export class AdminAccessAuthGuard extends AuthGuard('admin-jwt-access') {}
@Injectable()
export class AdminAccessStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt-access',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('TOKEN_SECRET'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { _id: ObjectId }) {
    const refreshCookieName = this.configService.get<string>(
      'REFRESH_COOKIE_NAME',
    );

    const refreshToken = getRefreshToken(req, refreshCookieName);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const user: User = await this.usersService.getUserById(payload._id);

    if (isNullOrUndefined(user) || user.role !== Role.Admin) {
      throw new UnauthorizedException();
    }
    const isValid = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      new ObjectId(payload._id),
    );
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
