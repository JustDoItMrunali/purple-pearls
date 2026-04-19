"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Works whether running via ts-node (src/) or compiled (dist/)
const uploadDir = path_1.default.join(process.cwd(), "uploads");
console.log("Multer upload dir:", uploadDir); // Remove after confirming
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedExts = /jpeg|jpg|png|webp/;
        const extOk = allowedExts.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimeOk = /image\/(jpeg|jpg|png|webp)/.test(file.mimetype);
        if (extOk && mimeOk)
            return cb(null, true);
        cb(new Error("Invalid file type"));
    },
});
