import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface ContextParams {
  params: {
    farmId: string;
  };
}
export const GET = async (_request: NextRequest, context: ContextParams) => {
  const farmId = context.params.farmId;

  if (!farmId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing farmId' }),
      { status: 400 },
    );
  }
  try {
    const data = await prisma.farm.findUnique({
      where: { id: farmId },
      include: {
        farmAddress: true,
        productionUnits: {
          include: {
            YearBasedPredicationProductionUnit: true,
            FeedProfileProductionUnit: true,
          },
        },
        production: true,
        FeedProfile: true,
        FarmManger: true,
        WaterQualityPredictedParameters: {
          include: { YearBasedPredication: true },
        },
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
