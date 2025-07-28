import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.waterAvg && body.waterAvg.id) {
      await prisma.waterManageHistoryAvgrage.create({
        data: {
          DO: body.waterAvg.DO,
          NH4: body.waterAvg.NH4,
          NO2: body.waterAvg.NO2,
          NO3: body.waterAvg.NO3,
          TSS: body.waterAvg.TSS,
          ph: body.waterAvg.ph,
          waterTemp: body.waterAvg.waterTemp,
          visibility: body.waterAvg.visibility,
          productionId: Number(body.waterAvg.id),
        },
      });
    }

    for (const data of body.listData) {
      await prisma.waterManageHistory.create({
        data: {
          currentDate: data.date,
          DO: data.DO,
          NH4: data.NH4,
          NO2: data.NO2,
          NO3: data.NO3,
          TSS: data.TSS,
          ph: data.ph,
          waterTemp: data.waterTemp,
          visibility: data.visibility,
          productionId: Number(data.id),
        },
      });

      if (body.waterAvg && body.waterAvg.id) {
        await prisma.production.update({
          where: { id: body.waterAvg.id },
          data: {
            fishFarmId: body.waterAvg.fishFarm,
            productionUnitId: body.waterAvg.productionUnit,
            DO: body.waterAvg.DO,
            NH4: body.waterAvg.NH4,
            NO2: body.waterAvg.NO2,
            NO3: body.waterAvg.NO3,
            TSS: body.waterAvg.TSS,
            ph: body.waterAvg.ph,
            waterTemp: body.waterAvg.waterTemp,
            visibility: body.waterAvg.visibility,
          },
        });
      } else {
        await prisma.production.create({
          data: {
            fishFarmId: body.waterAvg.fishFarm,
            productionUnitId: body.waterAvg.productionUnit,
            DO: body.waterAvg.DO,
            NH4: body.waterAvg.NH4,
            NO2: body.waterAvg.NO2,
            NO3: body.waterAvg.NO3,
            TSS: body.waterAvg.TSS,
            ph: body.waterAvg.ph,
            waterTemp: body.waterAvg.waterTemp,
            visibility: body.waterAvg.visibility,
          },
        });
      }
    }
    return NextResponse.json({
      message: 'Water Added successfully',
      status: true,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
