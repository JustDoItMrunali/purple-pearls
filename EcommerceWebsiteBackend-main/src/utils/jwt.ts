import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";
export const COOKIE_NAME = "sid_token";
interface JwtPayload extends jwt.JwtPayload {
  sub: string; //user id
  jti: string; //session id
  email: string;
}
function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
}

// function verifyToken(token: string): JwtPayload | string {
//     return jwt.verify(token, JWT_SECRET) as JwtPayload;
// }
function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
  if (typeof decoded === "string" || !decoded.jti || !decoded.email) {
    throw new Error("Invalid token payload");
  }
  return decoded;
}
export { signToken, verifyToken, JwtPayload };
