import { InvitationEmail } from "@/app/_lib/emailTemplate/invitationEmail";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

      //Find the user and make them Farm Manager
      const updateManagerRoles = async (managerIds: string[]) => {
        await Promise.all(
          managerIds.map(async (userId) => {
            await prisma.user.update({
              where: { id: Number(userId) },
              data: { role: "FARMMANAGER" },
            });
          })
        );
      };
      await updateManagerRoles(body.mangerId);
    }

    // Create production units one by one to retrieve their ids
    const newProductUnits = [];

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
    }

    // Create production managers using the ids of the created production units
    const newProductionManage = await prisma.production.createMany({
      data: newProductUnits.map((unit: any) => ({
        fishFarmId: farm.id,
        productionUnitId: unit.id, // Use the production unit id
        organisationId: body.organsationId,
      })),
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
