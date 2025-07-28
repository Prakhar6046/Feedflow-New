import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const organisationId = searchParams.get('organisationId');
    const query = searchParams.get('query');

    const feedSupplys = await prisma.feedSupply.findMany({
      where: {
        ...(role !== 'SUPERADMIN'
          ? { organisationId: Number(organisationId) }
          : {}),
        AND: [
          query
            ? {
                OR: [
                  {
                    productName: { contains: query, mode: 'insensitive' },
                  },
                  { productCode: { contains: query, mode: 'insensitive' } },
                  {
                    productionIntensity: {
                      contains: query,
                      mode: 'insensitive',
                    },
                  },
                  { feedingPhase: { contains: query, mode: 'insensitive' } },
                  { specie: { contains: query, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: 'desc', // Sort by createdAt in descending order
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: feedSupplys,
      }),
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
