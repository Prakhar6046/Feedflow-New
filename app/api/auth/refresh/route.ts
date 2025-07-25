import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'access-secret-key';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'refresh-secret-key';

export const GET = async (req: NextRequest) => {
  try {
    const refreshToken = req.cookies.get('refresh-token')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'id' in decoded &&
      'email' in decoded
    ) {
      const payload = decoded as { id: number; email: string };

      const newAccessToken = jwt.sign(
        { id: payload.id, email: payload.email },
        JWT_SECRET,
        { expiresIn: '15m' },
      );
      return NextResponse.json({ accessToken: newAccessToken });
    } else {
      throw new Error('Invalid refresh token');
    }
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
