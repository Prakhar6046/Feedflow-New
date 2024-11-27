import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    for (const data of body) {
      if (data.id && data.waterQualityId) {
        await prisma.waterQuality.update({
          where: { id: data.waterQualityId },
          data: {
            currentDate: data.date,
            DO: data.DO,
            NH4: data.NH4,
            NO2: data.NO2,
            NO3: data.NO3,
            ph: data.ph,
            TSS: data.TSS,
            visibility: data.visibility,
            waterTemp: data.waterTemp,
          },
        });
      } else {
        await prisma.waterQuality.create({
          data: {
            currentDate: data.date,
            DO: data.DO,
            NH4: data.NH4,
            NO2: data.NO2,
            NO3: data.NO3,
            ph: data.ph,
            TSS: data.TSS,
            visibility: data.visibility,
            waterTemp: data.waterTemp,
            productionId: data.id,
          },
        });
      }
    }

    return NextResponse.json({
      message: "Water Quality Added successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
