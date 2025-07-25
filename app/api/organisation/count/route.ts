import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const organisationCount = await prisma.organisationCount.findUnique({
      where: { id: 1 },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: organisationCount?.count }),
      {
        status: 200,
      },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
