import { signAccessToken, verifyRefreshToken } from '@/app/_lib/jwt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const refreshToken = await req.json();

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const user = verifyRefreshToken(refreshToken) as any;
    const newAccessToken = signAccessToken({
      userId: user.userId,
      email: user.email,
    });

    cookies().set('auth-token', newAccessToken, {
      httpOnly: false,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
    });
    return NextResponse.json({ accessToken: newAccessToken });
  } catch {
    return NextResponse.json(
      { error: 'Invalid refresh token' },
      { status: 401 },
    );
  }
}
