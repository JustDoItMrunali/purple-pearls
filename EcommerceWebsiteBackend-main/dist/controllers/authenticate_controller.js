"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../data.source");
const User_1 = require("../entities/User");
const password_1 = require("../utils/password");
const sessionStorage_1 = require("../utils/sessionStorage");
const jwt_1 = require("../utils/jwt");
const uuid_1 = require("uuid");
const AppError_1 = require("../utils/AppError");
const resetCodes = new Map();
const RESET_TTL_MS = 5 * 60 * 1000;
class AuthController {
    static async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                // return res;
                return next(new AppError_1.AppError("Email ,name, password are required", 400));
            }
            const authRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const existUser = await authRepo.findOneBy({
                email: email.toLowerCase(),
            });
            if (existUser) {
                return next(new AppError_1.AppError("Email already exists", 400));
            }
            const user = authRepo.create({
                email: email.toLowerCase(),
                name: name.toLowerCase(),
                passwordHash: await (0, password_1.hashPassowrd)(password),
                role: User_1.UserRole.USER,
                isLocked: false,
            });
            await authRepo.save(user);
            return res
                .status(201)
                .json({ message: "User created ", id: user.user_id });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new AppError_1.AppError("Email and password are required", 400));
            }
            const authRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await authRepo
                .createQueryBuilder("user")
                .addSelect("user.passwordHash")
                .where("user.email = :email", { email: email.toLowerCase() })
                .getOne();
            if (!user || !(await (0, password_1.verifyPassword)(password, user.passwordHash))) {
                return next(new AppError_1.AppError("Invalid credentials", 401));
            }
            const jti = (0, uuid_1.v4)();
            const token = (0, jwt_1.signToken)({
                sub: String(user.user_id),
                jti,
                email: user.email,
            });
            sessionStorage_1.sessionStore.create(jti, {
                userId: user.user_id,
                username: user.name,
                createdAt: new Date(),
                userAgent: req.headers["user-agent"] || "Unknown",
                ip: req.ip || "Unknown",
            });
            res.cookie(jwt_1.COOKIE_NAME, token, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ message: "Logged in successfully", user });
        }
        catch (error) {
            next(error);
        }
    }
    static async getUser(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "No user found" });
            }
            return res.status(200).json(req.user);
        }
        catch (err) {
            next(err);
        }
    }
    static async editProfile(req, res, next) {
        try {
            const { name, email, address, phone } = req.body;
            const userId = Number(req.params.user_id);
            if (!req.user) {
                return res.status(404).json({ error: "Unauthorized user" });
            }
            if (!name || name.trim() === "") {
                return res.status(400).json({ message: "Name is required" });
            }
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepo.findOneBy({ user_id: userId });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            user.name = name;
            user.address = address;
            user.phone = phone;
            user.email = email;
            const updatedUser = await userRepo.save(user);
            return res.status(200).json({ message: "Updated profile", user: updatedUser });
        }
        catch (err) {
            next(err);
        }
    }
    static async logout(req, res) {
        const user = req.user;
        sessionStorage_1.sessionStore.delete(user.jti);
        res.clearCookie(jwt_1.COOKIE_NAME);
        return res.status(200).json({ message: "Logged out" });
    }
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            if (!email)
                return res.status(400).json({ error: "Email is required" });
            const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({
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
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
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
            const authRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await authRepo.findOneBy({ email: email.toLowerCase() });
            if (!user)
                return res.status(404).json({ error: "User not found" });
            user.passwordHash = await (0, password_1.hashPassowrd)(newPassword);
            await authRepo.save(user);
            // Invalidate the code and all existing sessions for security
            resetCodes.delete(email.toLowerCase());
            sessionStorage_1.sessionStore.deleteAllForUser(user.user_id);
            return res
                .status(200)
                .json({ message: "Password updated. Please log in again." });
        }
        catch (error) {
            next(error);
        }
    }
    static async lockAccount(req, res, next) {
        try {
            const targetId = Number(req.params.userId);
            if (isNaN(targetId))
                return res.status(400).json({ error: "Invalid userId" });
            const authRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const target = await authRepo.findOneBy({ user_id: targetId });
            if (!target)
                return res.status(404).json({ error: "User not found" });
            target.isLocked = true;
            await authRepo.save(target);
            sessionStorage_1.sessionStore.deleteAllForUser(targetId);
            return res
                .status(200)
                .json({ message: `User ${targetId} has been locked` });
        }
        catch (error) {
            next(error);
        }
    }
    static async unlockAccount(req, res, next) {
        try {
            const targetId = Number(req.params.userId);
            if (isNaN(targetId))
                return res.status(400).json({ error: "Invalid userId" });
            const authRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const target = await authRepo.findOneBy({ user_id: targetId });
            if (!target)
                return res.status(404).json({ error: "User not found" });
            target.isLocked = false;
            await authRepo.save(target);
            return res
                .status(200)
                .json({ message: `User ${targetId} has been unlocked` });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
