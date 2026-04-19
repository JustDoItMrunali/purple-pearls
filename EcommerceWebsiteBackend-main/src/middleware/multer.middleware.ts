import multer from "multer";
import path from "path";
import fs from "fs";

// Works whether running via ts-node (src/) or compiled (dist/)
const uploadDir = path.join(process.cwd(), "uploads");

console.log("Multer upload dir:", uploadDir); // Remove after confirming

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|webp/;
    const extOk = allowedExts.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = /image\/(jpeg|jpg|png|webp)/.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error("Invalid file type"));
  },
});