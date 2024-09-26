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
