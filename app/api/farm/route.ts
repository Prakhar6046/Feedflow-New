import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

export const GET = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: 'Unauthorized: Token missing or invalid' },
      { status: 401 },
    );
  }

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
        FeedProfile: true,
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

    // Fetch fishFarmer organisation data for each farm
    const enrichedFarms = await Promise.all(
      farms.map(async (farm) => {
        let fishFarmerOrganisation = null;
        if (farm.fishFarmer) {
          fishFarmerOrganisation = await prisma.organisation.findUnique({
            where: { id: parseInt(farm.fishFarmer, 10) },
            select: {
              id: true,
              name: true,
              address: true,
              image: true,
              imageUrl: true,
            },
          });
        }
        return {
          ...farm,
          fishFarmerOrganisation,
        };
      })
    );

    return new NextResponse(
      JSON.stringify({ status: true, data: enrichedFarms }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[FARM_LIST_ERROR]', error);
    return new NextResponse(
      JSON.stringify({ status: false, error: 'Internal server error' }),
      { status: 500 }
    );
  }
};
