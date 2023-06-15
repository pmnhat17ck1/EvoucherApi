import { Injectable } from '@nestjs/common';

import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';

export class AdminAccessAuthGuard extends AuthGuard('admin-jwt-access') {}
@Injectable()
export class AdminAccessStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt-access',
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
    return payload;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
