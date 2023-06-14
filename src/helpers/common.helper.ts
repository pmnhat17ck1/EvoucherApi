import { Request } from 'express';
import jwtDecode from 'jwt-decode';
import { ObjectId } from 'mongodb';
import { User } from 'src/models/user';
import { isNullOrUndefined } from './util.helper';

export function getRefreshToken(req: Request, refreshCookieName: string) {
  if (!req.signedCookies || !req.signedCookies[refreshCookieName]) {
    return null;
  }
  return req.signedCookies[refreshCookieName];
}
/**
 * This function should only use for public apis.
 * The authorization is not guaranteed.
 */
export function getUserIdFromHeader(req: Request) {
  const authorization = req.headers['authorization'];
  if (isNullOrUndefined(authorization)) {
    return null;
  }
  const [, token] = `${authorization}`.split(' ');
  const payload = jwtDecode<{ _id: string }>(token);
  return new ObjectId(payload._id);
}

// export function getClientUserId(req: Request) {
//   if (isNullOrUndefined(req.user)) {
//     return null;
//   }
//   return new ObjectId((<User>req.user)._id);
// }

export function getClientUser(req: any) {
  if (isNullOrUndefined(req.user)) {
    return null;
  }
  return <User>req.user;
}

export function getFormattedString(
  pattern: string,
  values: { [key: string]: string },
) {
  let result = pattern;
  for (const key of Object.keys(values)) {
    const val = values[key];
    const regex = new RegExp(`\{${key}\}`);
    result = result.replace(regex, val);
  }
  return result;
}
