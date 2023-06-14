import * as bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
export function getHash(value: string, salt = 10): string {
  const hash = bcrypt.hashSync(value, salt);
  return hash;
}

export async function compareHash(value: string, hashedValue: string) {
  const isMatching = await bcrypt.compare(value, hashedValue);
  return isMatching;
}

export async function getTokens(payload: { _id: ObjectId }) {
  const { accessToken, accessTokenExpiresIn }: any = getAccessToken(payload);
  const { refreshToken, refreshTokenExpiresIn }: any = getRefreshToken(payload);
  const result = {
    accessToken,
    accessTokenExpiresIn,
    refreshToken,
    refreshTokenExpiresIn,
  };
  return result;
}

export async function getAccessToken(payload: { _id: ObjectId }) {
  const jwtService = new JwtService();
  const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRATION;
  const accessToken = jwtService.sign(payload, {
    secret: process.env.TOKEN_SECRET,
    expiresIn: 1000,
  });
  return { accessToken, accessTokenExpiresIn };
}

export async function getRefreshToken(payload: { _id: ObjectId }) {
  const jwtService = new JwtService();
  const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION;
  const refreshToken = jwtService.sign(payload, {
    secret: process.env.TOKEN_SECRET,
    expiresIn: 100000,
  });
  return { refreshToken, refreshTokenExpiresIn };
}
