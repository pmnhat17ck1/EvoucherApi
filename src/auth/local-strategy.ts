import { Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { UsersService } from './user.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private userService: UsersService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request, username: string, password: string) {
    const user = await this.userService.vaildateUser(username, password);
    if (!user) {
      throw new ForbiddenException('Tài khoản hoặc mật khảu không chính xác');
    }
    return user;
  }
}
