import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const filteredData = body.data.filter(
      (data: { field?: string }) => data.field,
    );

    for (const data of filteredData) {
      await prisma.fishManageHistory.create({
        data: {
          fishFarmId: data.fishFarm,
          productionUnitId: data.productionUnit,
          fishCount: data.count,
          batchNumberId: Number(data.batchNumber),
          biomass: data.biomass,
          meanLength: data.meanLength,
          meanWeight: data.meanWeight,
          stockingLevel: data.stockingLevel,
          stockingDensityKG: data.stockingDensityKG,
          stockingDensityNM: data.stockingDensityNM,
          organisationId: body.organisationId,
          currentDate: data.currentDate,
          age: '',
          field: data.field ?? '',
          productionId: Number(data.id),
        },
      });
    }
    for (const data of body.data) {
      if (data.id) {
        await prisma.production.update({
          where: { id: data.id },
          data: {
            fishFarmId: data.fishFarm,
            productionUnitId: data.productionUnit,
            fishCount: data.count,
            batchNumberId: Number(data.batchNumber),
            biomass: data.biomass,
            meanLength: data.meanLength,
            meanWeight: data.meanWeight,
            stockingLevel: data.stockingLevel,
            currentDate: data.currentDate,
            stockingDensityKG: data.stockingDensityKG,
            stockingDensityNM: data.stockingDensityNM,
            field: data.field ?? '',
          },
        });
      } else {
        await prisma.production.create({
          data: {
            fishFarmId: data.fishFarm,

            productionUnitId: data.productionUnit,
            fishCount: data.count,
            batchNumberId: Number(data.batchNumber),
            biomass: data.biomass,
            meanLength: data.meanLength,
            meanWeight: data.meanWeight,
            stockingLevel: data.stockingLevel,
            stockingDensityKG: data.stockingDensityKG,
            currentDate: data.currentDate,
            stockingDensityNM: data.stockingDensityNM,
            organisationId: body.organisationId,
            age: '',
            field: data.field ?? '',
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Unit Added successfully',
      status: true,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
