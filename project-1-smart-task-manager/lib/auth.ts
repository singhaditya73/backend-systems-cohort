import jwt, { JwtPayload } from "jsonwebtoken";

export type AuthPayload = JwtPayload & { userId?: string };

export function getTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const [, token] = authHeader.split(" ");
  return token || null;
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getUserIdFromRequest(req: Request): string | null {
  const token = getTokenFromHeader(req);
  if (!token) return null;

  const decoded = verifyToken(token);
  return decoded?.userId || null;
}
