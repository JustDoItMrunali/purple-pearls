import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data.source";
import { User, UserRole } from "../entities/User";
import { hashPassowrd, verifyPassword } from "../utils/password";
import { sessionStore } from "../utils/sessionStorage";
import { signToken, COOKIE_NAME } from "../utils/jwt";
import { v4 as uuidv4 } from "uuid";
import { error } from "node:console";

// declare module "express-session" {
//     interface SessionData {
//         user: { id: string; email: string }
//     }
// }
interface ResetEntry {
  code: string;
  expiresAt: number;
}

const resetCodes = new Map<string, ResetEntry>();
const RESET_TTL_MS = 5 * 60 * 1000;

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res
          .status(400)
          .json({ error: "email, password and name are required" });
      }
      const authRepo = AppDataSource.getRepository(User);
      const existUser = await authRepo.findOneBy({
        email: email.toLowerCase(),
      });
      if (existUser) {
        return res.status(409).json({ error: "Email already exists" });
      }
      const user = authRepo.create({
        email: email.toLowerCase(),
        name: name.toLowerCase(),
        passwordHash: await hashPassowrd(password),
        role: UserRole.USER,
        isLocked: false,
      });
      await authRepo.save(user);
      return res
        .status(201)
        .json({ message: "User created ", id: user.user_id });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password required" });
        return;
      }
      const authRepo = AppDataSource.getRepository(User);
      const user = await authRepo
        .createQueryBuilder("user")
        .addSelect("user.passwordHash")
        .where("user.email = :email", { email: email.toLowerCase() })
        .getOne();

      if (!user || !(await verifyPassword(password, user.passwordHash))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const jti = uuidv4();
      const token = signToken({
        sub: String(user.user_id),
        jti,
        email: user.email,
      });

      sessionStore.create(jti, {
        userId: user.user_id,
        username: user.name,
        createdAt: new Date(),
        userAgent: req.headers["user-agent"] || "Unknown",
        ip: req.ip || "Unknown",
      });
      res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        // sameSite: 'strict',
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Logged in successfully", user });
    } catch (error) {
      next(error);
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "No user found" });
      }
      return res.status(200).json(req.user);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response) {
    const user = req.user as User & { jti: string };
    sessionStore.delete(user.jti);
    res.clearCookie(COOKIE_NAME);
    return res.status(200).json({ message: "Logged out" });
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });

      const user = await AppDataSource.getRepository(User).findOneBy({
        email: email.toLowerCase(),
      });

      if (user) {
        const code = String(Math.floor(100000 + Math.random() * 9000));
        resetCodes.set(email.toLowerCase(), {
          code,
          expiresAt: Date.now() + RESET_TTL_MS,
        });

        return res.status(200).json({
          success: true,
          message: "Reset code generated",
          resetCode: code,
          expiresInSeconds: RESET_TTL_MS / 1000,
        });
      }
      return res
        .status(200)
        .json({ message: "If that email exists, a code was generated" });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code, newPassword } = req.body;
      if (!email || !code || !newPassword) {
        return res
          .status(400)
          .json({ error: "email, code and newPassword are required" });
      }
      const entry = resetCodes.get(email.toLowerCase());
      if (!entry || entry.code !== String(code)) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }

      if (Date.now() > entry.expiresAt) {
        resetCodes.delete(email.toLowerCase());
        return res.status(400).json({ error: "Code has expired" });
      }

      const authRepo = AppDataSource.getRepository(User);
      const user = await authRepo.findOneBy({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ error: "User not found" });

      user.passwordHash = await hashPassowrd(newPassword);
      await authRepo.save(user);

      // Invalidate the code and all existing sessions for security
      resetCodes.delete(email.toLowerCase());
      sessionStore.deleteAllForUser(user.user_id);

      return res
        .status(200)
        .json({ message: "Password updated. Please log in again." });
    } catch (error) {
      next(error);
    }
  }

  static async lockAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = Number(req.params.userId);
      if (isNaN(targetId))
        return res.status(400).json({ error: "Invalid userId" });

      const authRepo = AppDataSource.getRepository(User);
      const target = await authRepo.findOneBy({ user_id: targetId });
      if (!target) return res.status(404).json({ error: "User not found" });

      target.isLocked = true;
      await authRepo.save(target);

      sessionStore.deleteAllForUser(targetId);

      return res
        .status(200)
        .json({ message: `User ${targetId} has been locked` });
    } catch (error) {
      next(error);
    }
  }

  static async unlockAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const targetId = Number(req.params.userId);
      if (isNaN(targetId))
        return res.status(400).json({ error: "Invalid userId" });

      const authRepo = AppDataSource.getRepository(User);
      const target = await authRepo.findOneBy({ user_id: targetId });
      if (!target) return res.status(404).json({ error: "User not found" });

      target.isLocked = false;
      await authRepo.save(target);

      return res
        .status(200)
        .json({ message: `User ${targetId} has been unlocked` });
    } catch (error) {
      next(error);
    }
  }
}
