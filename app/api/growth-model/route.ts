import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    if (!body.organisationId) {
      return new NextResponse(
        JSON.stringify({ message: "Missing and Invalid orgainsation id" }),
        { status: 404 }
      );
    }

    if (!body.niloticusAureus || !body.niloticusThaiStrain) {
      return new NextResponse(
        JSON.stringify({
          message: "Niloticus Aureus or Niloticus Thai Strain data not found",
        }),
        { status: 404 }
      );
    }
    //creating Niloticus Aureus
    const niloticusAureus = await prisma.niloticusAureus.create({
      data: body.niloticusAureus,
    });

    //creating niloticus Thai Strain
    const niloticusThaiStrain = await prisma.niloticusThaiStrain.create({
      data: body.niloticusThaiStrain,
    });

    await prisma.growthModel.create({
      data: {
        organisationId: body.organisationId,
        niloticusAureusId: niloticusAureus.id,
        niloticusThaiStrainId: niloticusThaiStrain.id,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Growth models added succussfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
