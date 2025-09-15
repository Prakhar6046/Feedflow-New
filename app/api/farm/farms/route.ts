import prisma from '@/prisma/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
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
          })
        );

        return {
          ...farm,
          FishManageHistory: enrichedHistory,
        };
      })
    );

    return NextResponse.json({ status: true, data: enrichedFarms }, { status: 200 });
  } catch (error) {
    console.error('[FARM_LIST_ERROR]', error);
    return NextResponse.json(
      { status: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
