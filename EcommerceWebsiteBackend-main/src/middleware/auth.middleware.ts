import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { User, UserRole } from "../entities/User";
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: unknown, user: User | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        console.log("Passport Info:", info);
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      req.user = user;
      next();
    },
  )(req, res, next);
};
export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as { role: UserRole } | undefined;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "Forbidden: insufficient role" });
      return;
    }

    next();
  }; 
};
