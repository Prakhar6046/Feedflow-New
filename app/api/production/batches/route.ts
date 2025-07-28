import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const role = searchParams.get('role');
    // const organisationId = searchParams.get('organisationId');
    // const userId = searchParams.get('userId');

    const fishSupply = await prisma.fishSupply.findMany({});
    return new NextResponse(
      JSON.stringify({
        status: true,
        data: fishSupply,
      }),
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
