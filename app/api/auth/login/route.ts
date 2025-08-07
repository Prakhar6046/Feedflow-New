import { signAccessToken, signRefreshToken } from '@/app/_lib/jwt';
import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = email.toLowerCase();
    const tokenPayload = { email };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { organisation: { include: { Farm: true, contact: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.access) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      status: true,
      data: { token: accessToken, user },
    });
    cookies().set('auth-token', accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 1,
    });
    // Set refresh token cookie
    cookies().set('refresh-token', refreshToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
};
