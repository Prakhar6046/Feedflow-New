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
        FishManageHistory:true,
        WaterQualityPredictedParameters: {
          include: { YearBasedPredication: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ status: true, data: farms }, { status: 200 });
  } catch (error) {
    console.error('[FARM_LIST_ERROR]', error);
    return NextResponse.json(
      { status: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
};
