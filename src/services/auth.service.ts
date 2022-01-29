import jwt from 'jsonwebtoken';
import parse from 'parse-duration'

import config from "../config";
import IUser from "../app/models/interfaces/iUser";

export const generateJWT = (user: IUser) => {
  const now = new Date().getTime();
  try {
    return jwt.sign({
      iss: config.app.appName,
      sub: user._id,
      iat: new Date().getTime(),
      exp: now + parse(config.jwt.refreshTokenTTL)
    }, config.jwt.secret);
  } catch (err) {
    throw new Error(err);
  }
}

export const generateRefreshJWT = (user: IUser) => {
  const now = new Date().getTime();

  try {
    return jwt.sign({
      iss: config.app.appName,
      sub: user._id,
      iat: new Date().getTime(),
      exp: now + parse(config.jwt.refreshTokenTTL)
    }, config.jwt.secret);
  } catch (err) {
    throw new Error(err);
  }
}
