import { Injectable } from '@nestjs/common';
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
  constructor(private configService: ConfigService) {
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
    console.log(refreshToken);
    return payload;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
