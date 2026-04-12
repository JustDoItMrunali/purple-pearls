import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Request } from "express";
import { AppDataSource } from "../data.source";
import { sessionStore as sessionStoreUtil } from "./sessionStorage";
import { User } from "../entities/User";
import { JwtPayload, COOKIE_NAME } from "./jwt";

export const JWT_SECRET = process.env.JWT_SECRET || "change-me";

const cookieExtractor = (req: Request): string | null => {
  return req?.cookies?.[COOKIE_NAME] ?? null;
};

passport.use(
  "jwt",
  new JwtStrategy(
    { jwtFromRequest: cookieExtractor, secretOrKey: JWT_SECRET },
    async (payload: { sub: number; jti: string }, done) => {
      try {
        const session = sessionStoreUtil.get(payload.jti);
        if (!session) return done(null, false, { message: "Session expired" });

        const user = await AppDataSource.getRepository(User).findOneBy({
          user_id: Number(payload.sub),
        });
        if (!user) return done(null, false, { message: "User not found" });

        if (user.isLocked) {
          sessionStoreUtil.deleteAllForUser(user.user_id);
          return done(null, false, { message: "Account is locked" });
        }
        return done(null, { ...user, jti: payload.jti });
      } catch (err) {
        return done(err, false, { message: "unknown error " });
      }
    },
  ),
);

export default passport;
