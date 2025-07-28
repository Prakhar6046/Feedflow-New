import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface ContextParams {
  params: {
    feedSupplyId: string;
  };
}
export const GET = async (_request: NextRequest, context: ContextParams) => {
  const feedId = context.params.feedSupplyId;

  if (!feedId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing feedId' }),
      { status: 400 },
    );
  }
  try {
    const data = await prisma.feedSupply.findUnique({
      where: { id: feedId },
    });
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
