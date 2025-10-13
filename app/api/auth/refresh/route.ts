import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, signAccessToken } from '@/app/_lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken = body.refreshToken;

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const user = verifyRefreshToken(refreshToken) as any;

    const newAccessToken = signAccessToken({
      userId: user.userId,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    cookies().set('auth-token', newAccessToken, {
      httpOnly: false, 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
    });

    return NextResponse.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh token verification failed:', err);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
