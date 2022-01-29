import passportJWT from 'passport-jwt';
import config from "../../../config";
import IUser from "../../models/interfaces/iUser";
import UserRepository from "../../../repositories/userRepository";

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const userRepository = new UserRepository();

const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt.secret,
    issuer: config.app.appName,
};

const jwtAuthStrategy = new JWTStrategy(options,
  (jwtPayload, done) => {
    userRepository.findById(jwtPayload.sub)
      .then((user: IUser) => {
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      })
      .catch((err: unknown) => {
        return done(err, false);
      });
  }
);

export default jwtAuthStrategy;
