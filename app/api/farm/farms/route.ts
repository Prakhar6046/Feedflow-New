import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
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
        FishManageHistory: {
          include: {
            FishSupply: true,
          },
        },
        WaterQualityPredictedParameters: {
          include: { YearBasedPredication: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const enrichedFarms = await Promise.all(
      farms.map(async (farm) => {
        const enrichedHistory = await Promise.all(
          farm.FishManageHistory.map(async (history) => {
            if (!history.batchNumberId) return history;

            const fishSupply = await prisma.fishSupply.findFirst({
              where: { id: history.batchNumberId },
            });

            return {
              ...history,
              speciesId: fishSupply?.speciesId ?? null,
              fishSupplyData: fishSupply ?? null,
            };
          }),
        );

        // Map production units to include allocatedWorkers array
        const productionUnitsWithWorkers = farm.productionUnits.map((unit: any) => ({
          ...unit,
          allocatedWorkers: unit.ProductionUnitWorker?.map((pw: any) => pw.userId) || [],
        }));

        return {
          ...farm,
          productionUnits: productionUnitsWithWorkers,
          FishManageHistory: enrichedHistory,
        };
      }),
    );

    return NextResponse.json(
      { status: true, data: enrichedFarms },
      { status: 200 },
    );
  } catch (error) {
    console.error('[FARM_LIST_ERROR]', error);
    return NextResponse.json(
      { status: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
