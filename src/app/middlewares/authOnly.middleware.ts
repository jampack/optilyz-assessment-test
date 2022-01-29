import passport from "passport";

const authOnly = passport.authenticate('jwt', {session: false});

export default authOnly;
