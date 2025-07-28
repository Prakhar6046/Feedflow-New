import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const organisationId = searchParams.get('organisationId');
    const hasFeedSupplierOrg = await prisma.organisation.findMany({
      where: { organisationType: 'Feed Supplier' },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: hasFeedSupplierOrg }),
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
