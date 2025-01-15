import { InvitationEmail } from "@/app/_lib/emailTemplate/invitationEmail";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const productionParameter = body.productionParameter;
    if (!productionParameter || !body.farmAddress || !body.productionUnits) {
      return NextResponse.json(
        { error: "All required payload missing or invalid" },
        { status: 404 }
      );
    }

    const newFarmAddress = await prisma.farmAddress.create({
      data: { ...body.farmAddress },
    });

    const farm = await prisma.farm.create({
      data: {
        farmAddressId: newFarmAddress.id,
        name: body.name,
        farmAltitude: body.farmAltitude,
        fishFarmer: body.fishFarmer,
        lat: body.lat,
        lng: body.lng,
        organisationId: body.organsationId,
        userId: body.userId,
      },
    });
    //Creating farm manager
    if (body?.mangerId?.length) {
      await prisma.farmManager.createMany({
        data: body.mangerId.map((userId: string) => ({
          farmId: farm.id,
          userId: Number(userId),
        })),
      });
    }

    // Create production units one by one to retrieve their ids
    const newProductUnits = [];
    const newSamplingEnvironment = [];
    const newSamplingStock = [];

    for (const unit of body.productionUnits) {
      const newUnit = await prisma.productionUnit.create({
        data: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: farm.id, // Associate each production unit with the created farm
        },
      });
      newProductUnits.push(newUnit); // Store each created production unit
      newSamplingEnvironment.push(newUnit);
      newSamplingStock.push(newUnit);
    }

    // Create production managers using the ids of the created production units
    const newProductionManage = await prisma.production.createMany({
      data: newProductUnits.map((unit: any) => ({
        fishFarmId: farm.id,
        productionUnitId: unit.id, // Use the production unit id
        organisationId: body.organsationId,
      })),
    });

    //Creating production parameter
    const paylaodForProductionParameter = {
      ...productionParameter,
      idealRange: productionParameter.idealRange,
    };
    await prisma.waterQualityPredictedParameters.create({
      data: {
        farmId: farm.id,
        YearBasedPredication: { create: { ...paylaodForProductionParameter } },
      },
    });

    return NextResponse.json({
      message: "Farm created successfully",
      data: "farm",
      status: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
