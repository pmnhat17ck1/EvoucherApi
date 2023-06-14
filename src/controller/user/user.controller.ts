import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
// import { JwtAccessStrategy } from 'src/auth/jwt-access.strategy';
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
    // const webDomain = this.configService.get<string>('WEB_DOMAIN');
    // await this.userService.sendEmailConfirmation(webDomain, clientUser);
    return { data: { _id: clientUser._id } };
  }

  @Post('login')
  async login(@Req() req: any, @Body() body: LoginRequest) {
    const data = await this.userService.login(body);
    return data;
  }
  // @UseGuards(JwtAccessStrategy)
  @Get('getAll')
  async getAll(@Req() req: any, @Body() body: LoginRequest) {
    const data = await this.userService.getAll();
    return data;
  }
}
