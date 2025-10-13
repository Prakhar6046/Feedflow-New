import { signAccessToken, signRefreshToken } from '@/app/_lib/jwt';
import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = email.toLowerCase();
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

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: String(user.role),
      organizationId: user.organisationId,
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    cookies().set('auth-token', accessToken, {
      httpOnly: false,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 minutes
    });
    cookies().set('refresh-token', refreshToken, {
      httpOnly: false,
      path: '/',
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      status: true,
      data: { user },
    });
  } catch (error) {
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
};
