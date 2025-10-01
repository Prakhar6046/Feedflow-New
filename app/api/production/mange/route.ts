import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body",body);

    const dataArray = Array.isArray(body.data) ? body.data : [body.data];


    for (const data of dataArray) {

      await prisma.fishManageHistory.create({
        data: {
          fishFarmId: data.fishFarm,
          productionUnitId: data.productionUnit,
          fishCount: data.count,
          batchNumberId: data.batchNumber ? Number(data.batchNumber) : null,
          fishSupplyId: data.batchNumber ? Number(data.batchNumber) : null,
          biomass: data.biomass,
          meanLength: data.meanLength,
          meanWeight: data.meanWeight,
          stockingLevel: data.stockingLevel,
          stockingDensityKG: data.stockingDensityKG,
          stockingDensityNM: data.stockingDensityNM,
          organisationId: body.organisationId ?? null,
          currentDate: data.currentDate,
          age: '',
          field: data.field ?? '',
          productionId: data.id ? Number(data.id) : null,
        },
      });


      const safeBatchNumber = data.batchNumber ? Number(data.batchNumber) : null;

      if (data.id) {

        await prisma.production.update({
          where: { id: Number(data.id) },
          data: {
            fishFarmId: data.fishFarm,
            productionUnitId: data.productionUnit,
            fishCount: data.count,
            batchNumberId: safeBatchNumber,
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
            batchNumberId: safeBatchNumber,
            biomass: data.biomass,
            meanLength: data.meanLength,
            meanWeight: data.meanWeight,
            stockingLevel: data.stockingLevel,
            stockingDensityKG: data.stockingDensityKG,
            stockingDensityNM: data.stockingDensityNM,
            organisationId: body.organisationId ?? null,
            age: '',
            currentDate: data.currentDate,
            field: data.field ?? '',
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Production batch and fish history saved successfully',
      status: true,
    });
  } catch (error: any) {
    console.error('Error in POST /api/production/batches', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
