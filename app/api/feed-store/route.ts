import { FeedProduct } from '@/app/_typeModels/Feed';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
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
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
export async function PUT(request: NextRequest) {
  try {
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
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
export async function POST(request: NextRequest) {
  try {
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
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
