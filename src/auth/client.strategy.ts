import { UsersService } from './user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { getRefreshToken } from 'src/helpers/common.helper';

export class ClientAccessAuthGuard extends AuthGuard('jwt-access') {}
@Injectable()
export class ClientAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
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
    const user = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      new ObjectId(payload._id),
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
