import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'access-secret-key';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';

export const verifyAndRefreshToken = async (req: Request): Promise<any> => {
  const authHeader = req.headers.get('authorization');
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh-token')?.value;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { status: false, message: 'Unauthorized: Token missing or invalid' },
      { status: 401 },
    );
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    if (accessToken) {
      return true;
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        // 🔁 Try to refresh access token if refresh-token exists
        if (!refreshToken)
          throw new Error('Access token expired and no refresh token');

        try {
          const decodedRefresh = jwt.verify(
            refreshToken,
            JWT_REFRESH_SECRET,
          ) as any;

          // ✅ Generate new access token
          const newAccessToken = jwt.sign(
            { id: decodedRefresh.id, email: decodedRefresh.email },
            JWT_SECRET,
            { expiresIn: '15m' },
          );

          // You can optionally set it in cookies or just return it
          return jwt.verify(newAccessToken, JWT_SECRET);
        } catch {
          throw new Error('Refresh token expired or invalid');
        }
      }
    }

    return NextResponse.json(
      { status: false, message: 'Unauthorized: Token missing or invalid' },
      { status: 401 },
    );
  }
};
