import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');
  const organisationId = searchParams.get('organisationId');
  const query = searchParams.get('query');
  const filter = searchParams.get('filter');

  try {
    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
        organisation: true,
        productionUnits: {
          include: {
            YearBasedPredicationProductionUnit: true,
            FeedProfileProductionUnit: true,
          },
        },
        production: true,
        WaterQualityPredictedParameters: {
          include: { YearBasedPredication: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        ...(filter === 'true'
          ? {}
          : role !== 'SUPERADMIN' && organisationId
            ? { organisationId: Number(organisationId) }
            : {}),

        AND: [
          query
            ? {
                OR: [
                  {
                    name: { contains: query, mode: 'insensitive' },
                  },
                ],
              }
            : {},
        ],
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data: farms }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
