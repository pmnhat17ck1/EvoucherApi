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
export function setNameImage(req, file, cb) {
  const name = req.body.username;
  const fileExtension =
    file.originalname.split('.')[file.originalname.split('.').length - 1];
  const newFileName = name + '_' + Date.now() + '.' + fileExtension;
  cb(null, newFileName);
}
export function setNameImageCampaign(req, file, cb) {
  const name = req.body.name.replace(/\s/g, '');
  const fileExtension =
    file.originalname.split('.')[file.originalname.split('.').length - 1];
  const newFileName = name + '_' + Date.now() + '.' + fileExtension;
  cb(null, newFileName);
}
export function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(null, false);
  }
  cb(null, true);
}
export function getUserId(req: any) {
  if (isNullOrUndefined(req.user)) {
    return null;
  }
  return new ObjectId(req.user._id);
}

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
