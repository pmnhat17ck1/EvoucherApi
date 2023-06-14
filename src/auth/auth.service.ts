import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
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
    const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRATION;
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn: 1000,
    });
    return { accessToken, accessTokenExpiresIn };
  }

  async getRefreshToken(payload: { _id: ObjectId }) {
    const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION;
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.TOKEN_SECRET,
      expiresIn: 10000,
    });
    return { refreshToken, refreshTokenExpiresIn };
  }
}
