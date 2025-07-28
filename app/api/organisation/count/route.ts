import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export const GET = async () => {
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
