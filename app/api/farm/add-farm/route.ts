import { InvitationEmail } from "@/app/_lib/emailTemplate/invitationEmail";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const newFarmAddress = await prisma.farmAddress.create({
      data: { ...body.farmAddress },
    });
    const farm = await prisma.farm.create({
      data: {
        farmAddressId: newFarmAddress.id,
        name: body.name,
        farmAltitude: body.farmAltitude,
      },
    });
    const newProductUnit = await prisma.productionUnit.createMany({
      data: body.productionUnits.map((unit: any) => ({
        name: unit.name,
        type: unit.type,
        capacity: unit.capacity,
        waterflowRate: unit.waterflowRate,
        farmId: farm.id, // Associate each production unit with the created farm
      })),
    });

    return NextResponse.json({
      message: "Farm created successfully",
      data: farm,
      status: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body.productionUnits);

    // Ensure that the farmAddress contains an id for updating
    if (!body.farmAddress.id) {
      throw new Error("Farm address ID is required for updating.");
    }

    // Update the existing farm address
    const updatedFarmAddress = await prisma.farmAddress.update({
      where: { id: body.farmAddress.id }, // Ensure that farmAddress contains an id
      data: { ...body.farmAddress },
    });

    // Update the existing farm
    const updatedFarm = await prisma.farm.update({
      where: { id: body.id },
      data: {
        farmAddressId: updatedFarmAddress.id,
        name: body.name,
        farmAltitude: body.farmAltitude,
      },
    });

    // Upsert production units (create if doesn't exist, update if it does)

    // for (const unit of body.productionUnits) {
    //   await prisma.productionUnit.upsert({
    //     where: { id: unit.id || "" }, // Assuming each contact has an `id`
    //     update: {
    //       name: unit.name,
    //       type: unit.type,
    //       capacity: unit.capacity,
    //       waterflowRate: unit.waterflowRate,
    //       farmId: updatedFarm.id,
    //     },
    //     create: {
    //       name: unit.name,
    //       type: unit.type,
    //       capacity: unit.capacity,
    //       waterflowRate: unit.waterflowRate,
    //       farmId: updatedFarm.id,
    //     },
    //   });
    // }
    const existingUnits = await prisma.productionUnit.findMany({
      where: { farmId: updatedFarm.id },
    });

    // Create or update the units present in the body
    const unitIds = body.productionUnits.map((unit: any) => unit.id);

    for (const unit of body.productionUnits) {
      await prisma.productionUnit.upsert({
        where: { id: unit.id || "" },
        update: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: updatedFarm.id,
        },
        create: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: updatedFarm.id,
        },
      });
    }

    // Delete units that are not in the updated list
    const unitsToDelete = existingUnits.filter(
      (existingUnit) => !unitIds.includes(existingUnit.id)
    );

    for (const unit of unitsToDelete) {
      await prisma.productionUnit.delete({
        where: { id: unit.id },
      });
    }
    return NextResponse.json({
      message: "Farm updated successfully",
      data: updatedFarm,
      status: true,
    });
  } catch (error: any) {
    console.error("Error updating farm:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
