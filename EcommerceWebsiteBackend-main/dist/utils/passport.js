"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const data_source_1 = require("../data.source");
const sessionStorage_1 = require("./sessionStorage");
const User_1 = require("../entities/User");
const jwt_1 = require("./jwt");
exports.JWT_SECRET = process.env.JWT_SECRET || "change-me";
const cookieExtractor = (req) => {
    return req?.cookies?.[jwt_1.COOKIE_NAME] ?? null;
};
passport_1.default.use("jwt", new passport_jwt_1.Strategy({ jwtFromRequest: cookieExtractor, secretOrKey: exports.JWT_SECRET }, async (payload, done) => {
    try {
        const session = sessionStorage_1.sessionStore.get(payload.jti);
        if (!session)
            return done(null, false, { message: "Session expired" });
        const user = await data_source_1.AppDataSource.getRepository(User_1.User).findOneBy({
            user_id: Number(payload.sub),
        });
        if (!user)
            return done(null, false, { message: "User not found" });
        if (user.isLocked) {
            sessionStorage_1.sessionStore.deleteAllForUser(user.user_id);
            return done(null, false, { message: "Account is locked" });
        }
        return done(null, { ...user, jti: payload.jti });
    }
    catch (err) {
        return done(err, false, { message: "unknown error " });
    }
}));
exports.default = passport_1.default;
