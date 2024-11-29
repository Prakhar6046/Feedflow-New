import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body.data);

    for (const data of body.data) {
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
          age: "",
          field: data.field ?? "",
          productionId: Number(data.id),
        },
      });

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
              stockingDensityKG: data.stockingDensityKG,
              stockingDensityNM: data.stockingDensityNM,
              field: data.field ?? "",
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
              stockingDensityNM: data.stockingDensityNM,
              organisationId: body.organisationId,
              age: "",
              field: data.field ?? "",
            },
          });
        }
      }
    }
    return NextResponse.json({
      message: "Unit Added successfully",
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
