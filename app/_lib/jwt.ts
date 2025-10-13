import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function signAccessToken(payload: {
  userId: number;
  email: string;
  role: string;
  organizationId: number;
}) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '1m' });
}

export function signRefreshToken(payload: {
  userId: number;
  email: string;
  role: string;
  organizationId: number;
}) {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}
