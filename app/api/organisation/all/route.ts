import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const role = searchParams.get('role');
    const organisations = await prisma.organisation.findMany({});

    return new NextResponse(
      JSON.stringify({ status: true, data: organisations }),
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
