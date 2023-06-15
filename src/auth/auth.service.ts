import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as moment from 'moment';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async getTokens(payload: { _id: ObjectId }) {
    const { accessToken, accessTokenExpiresIn }: any =
      await this.getAccessToken(payload);
    const { refreshToken, refreshTokenExpiresIn }: any =
      await this.getRefreshToken(payload);
    const result = {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    };
    return result;
  }

  async getAccessToken(payload: { _id: ObjectId }) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
    const decodedToken = this.jwtService.verify(accessToken);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const accessTokenExpiresIn = moment(expirationDate).format(
      'YYYY-MM-DD HH:mm:ss',
    );

    return { accessToken, accessTokenExpiresIn };
  }

  async getRefreshToken(payload: { _id: ObjectId }) {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });
    const decodedToken = this.jwtService.verify(refreshToken);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const refreshTokenExpiresIn = moment(expirationDate).format(
      'YYYY-MM-DD HH:mm:ss',
    );
    return { refreshToken, refreshTokenExpiresIn };
  }
}
