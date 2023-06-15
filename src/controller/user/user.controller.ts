import { LocalAuthGuard } from './../../auth/local-strategy';
import ms = require('ms');
import { ClientAccessAuthGuard } from '../../auth/client.strategy';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginRequest, RegisterRequest } from 'src/models/requests/user.req';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}
  @Get('')
  async queryUsers() {
    return { test: 'test' };
  }

  @Post('register')
  async register(@Body() body: RegisterRequest) {
    const clientUser = await this.userService.register(body);
    return { data: { _id: clientUser._id } };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Body() body: LoginRequest) {
    const data = await this.userService.login(req.user);
    const refreshCookieName = this.configService.get('REFRESH_COOKIE_NAME');
    req.res.cookie(refreshCookieName, data.token.refreshToken, {
      httpOnly: true,
      maxAge: ms(data.token.refreshTokenExpiresIn),
      signed: true,
      secure: process.env.MODE !== 'dev',
      sameSite: 'lax',
    });
    delete data.token.refreshToken;
    delete data.token.refreshTokenExpiresIn;
    return data;
  }

  @UseGuards(ClientAccessAuthGuard)
  @Get('getAll')
  async getAll() {
    const data = await this.userService.getAll();
    return data;
  }
}
