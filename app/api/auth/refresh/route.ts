import { signAccessToken, verifyRefreshToken } from '@/app/_lib/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken = body.refreshToken;

    if (!refreshToken) {
      console.error('No refresh token in request body');
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const user = verifyRefreshToken(refreshToken) as any;

    const newAccessToken = signAccessToken({
      userId: user.userId,
      email: user.email,
    });

    // Set new access token as httpOnly cookie
    cookies().set('auth-token', newAccessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 minutes
    });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
