import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAndRefreshToken(request);
    if (user.status === 401) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: 'Unauthorized: Token missing or invalid',
        }),
        { status: 401 },
      );
    }
    const body = await request.json();
    const newFeedSupply = await prisma.feedSupply.create({ data: body });

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: newFeedSupply,
        message: 'New feed supply created',
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
