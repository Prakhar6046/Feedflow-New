import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
import { FeedProduct } from '@/app/_typeModels/Feed';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const organisationId = searchParams.get('organisationId');
    const query = searchParams.get('query');

    const feedStores = await prisma.feedStore.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: feedStores,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
export async function PUT(request: NextRequest) {
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

    await Promise.all(
      body?.map((item: FeedProduct) =>
        prisma.feedStore.updateMany({
          where: { id: item.id },
          data: { ...item },
        }),
      ),
    );
    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'Feed store updated successfully.',
        // data: updatedFeedStores,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
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
    const data = body;

    if (!Object.keys(data).length) {
      return NextResponse.json({
        status: false,
        message: 'Some feilds are missing',
      });
    }

    await prisma.feedStore.create({ data });
    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'Feed Added successfully.',
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
