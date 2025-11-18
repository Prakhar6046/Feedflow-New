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

  // Get user ID from verified token (user is the decoded JWT token)
  const userId = (user as any)?.id || (user as any)?.userId;

  // Check if user is a General worker (level 1 or 2)
  const isGeneralWorker = (user as any)?.role === 'General worker (level 1)' || (user as any)?.role === 'General worker (level 2)';

  try {
    // If user is a General worker, get their assigned production unit IDs
    let assignedProductionUnitIds: string[] = [];
    if (isGeneralWorker && userId) {
      const workerAssignments = await prisma.productionUnitWorker.findMany({
        where: { userId: Number(userId) },
        select: { productionUnitId: true },
      });
      assignedProductionUnitIds = workerAssignments.map((a) => a.productionUnitId);
    }

    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
        organisation: true,
        FeedProfile: true,
        productionUnits: {
          include: {
            YearBasedPredicationProductionUnit: true,
            FeedProfileProductionUnit: true,
            ProductionUnitWorker: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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
          // For General workers, only show farms that have production units they are assigned to
          isGeneralWorker && assignedProductionUnitIds.length > 0
            ? {
                productionUnits: {
                  some: {
                    id: { in: assignedProductionUnitIds },
                  },
                },
              }
            : {},
        ],
      },
    });

    // Fetch fishFarmer organisation data for each farm and map worker assignments
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
        
        // Map production units to include allocatedWorkers array
        // For General workers, only show production units they are assigned to
        let productionUnitsWithWorkers = farm.productionUnits.map((unit: any) => ({
          ...unit,
          allocatedWorkers: unit.ProductionUnitWorker?.map((pw: any) => pw.userId) || [],
        }));

        if (isGeneralWorker && assignedProductionUnitIds.length > 0) {
          productionUnitsWithWorkers = productionUnitsWithWorkers.filter((unit: any) =>
            assignedProductionUnitIds.includes(unit.id)
          );
        }

        return {
          ...farm,
          productionUnits: productionUnitsWithWorkers,
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
