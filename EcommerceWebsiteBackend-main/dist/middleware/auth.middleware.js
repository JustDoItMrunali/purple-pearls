"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const requireAuth = (req, res, next) => {
    passport_1.default.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            console.log("Passport Info:", info);
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        req.user = user;
        next();
    })(req, res, next);
};
exports.requireAuth = requireAuth;
const requireRole = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
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
exports.requireRole = requireRole;
