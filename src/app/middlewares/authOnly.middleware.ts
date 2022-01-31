import passport from "passport";
import {unAuthorizedResponse} from "../../lib/responseWapper";
import {NextFunction, Request, Response} from "express";

const authOnly = (req: Request, res: Response, next: NextFunction) => passport.authenticate('jwt', {session: false}, (err, user) => {
  if (err) return next(err);

  if (!user) {
    return unAuthorizedResponse(res);
  } else {
    req.logIn(user, (loginError: unknown) => {
      if (err) {
        return next(loginError);
      }
      req.user = user;
      return next();
    });
  }
})(req, res, next);

export default authOnly;
