import bcrypt from "bcrypt";

export async function hashPassowrd(plain: string) {
    return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string) {
    return bcrypt.compare(plain, hash);
}