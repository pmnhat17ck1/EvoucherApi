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
  const accessToken = jwtService.sign(payload, {
    secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
  });
  const decodedToken = jwtService.verify(accessToken);
  const expirationDate = new Date(decodedToken.exp * 1000);
  const accessTokenExpiresIn = expirationDate.toISOString();
  return { accessToken, accessTokenExpiresIn };
}

export async function getRefreshToken(payload: { _id: ObjectId }) {
  const jwtService = new JwtService();
  const refreshToken = jwtService.sign(payload, {
    secret: process.env.TOKEN_SECRET,
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });
  const decodedToken = jwtService.verify(refreshToken);
  const expirationDate = new Date(decodedToken.exp * 1000);
  const refreshTokenExpiresIn = expirationDate.toISOString();
  return { refreshToken, refreshTokenExpiresIn };
}
