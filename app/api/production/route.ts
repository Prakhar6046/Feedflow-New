import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get('role');
  const organisationId = searchParams.get('organisationId');
  const userId = searchParams.get('userId');

  const query = searchParams.get('query');
  const filter = searchParams.get('filter');

  try {
    const productions = await prisma.production.findMany({
      include: {
        farm: { include: { productionUnits: true } },
        organisation: true,
        productionUnit: {
          include: { YearBasedPredicationProductionUnit: true },
        },
        fishSupply: true,

        WaterManageHistory: {
          orderBy: {
            id: 'asc',
          },
        },
        FishManageHistory: {
          orderBy: {
            id: 'asc',
          },
        },
        WaterManageHistoryAvgrage: {
          orderBy: {
            id: 'asc',
          },
        },
      },
      orderBy: {
        id: 'asc',
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
                    biomass: { contains: query, mode: 'insensitive' },
                  },
                  {
                    fishCount: { contains: query, mode: 'insensitive' },
                  },
                  {
                    meanWeight: { contains: query, mode: 'insensitive' },
                  },
                  {
                    stockingLevel: { contains: query, mode: 'insensitive' },
                  },
                  {
                    stockingDensityNM: { contains: query, mode: 'insensitive' },
                  },
                  {
                    stockingDensityKG: { contains: query, mode: 'insensitive' },
                  },
                ],
              }
            : {},
        ],
      },
    });
    let dataWithIsManager;
    if (role !== 'SUPERADMIN') {
      // currentUserFarms = get farms for current user here
      const currentUserFarms = await prisma.farmManger.findMany({
        where: { userId: Number(userId) },
      });

      // foreach on product
      // assign IsManger currentUserFarms exist  production.farmId == currentUserFarms.farmId
      dataWithIsManager = productions.map((production) => {
        const farmId = currentUserFarms.find(
          (manager) => manager.farmId === production.fishFarmId,
        );

        if (production.fishFarmId === String(farmId?.farmId)) {
          return { ...production, isManager: true };
        } else {
          return production;
        }
      });
    } else {
      dataWithIsManager = productions.map((production) => {
        return { ...production, isManager: true };
      });
    }

    return new NextResponse(
      JSON.stringify({ status: true, data: dataWithIsManager }),
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const farm = await prisma.farm.findUnique({
      where: { id: body.fishFarmId },
    });
    if (!farm) {
      return NextResponse.json({
        message: 'Invaild or missing farm',
        status: false,
      });
    }

    const newProduction = await prisma.production.create({
      data: {
        fishFarmId: body.fishFarmId,
        productionUnitId: body.productionUnitId,
        fishCount: body.fishCount,
        batchNumberId: Number(body.batchNumber),
        biomass: body.biomass,
        meanLength: body.meanLength,
        meanWeight: body.meanWeight,
        age: body.age,
        stockingLevel: body.stockingLevel,
        stockingDensityKG: body.stockingDensityKG,
        stockingDensityNM: body.stockingDensityNM,
        organisationId: body.organisationId,
      },
    });
    return NextResponse.json({
      message: 'Unit created successfully',
      data: newProduction,
      status: true,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
