import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const organisationId = searchParams.get('organisationId');

    const hasHatcheryOrg = await prisma.organisation.findMany({
      where: { organisationType: 'Hatchery' },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: hasHatcheryOrg }),
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
