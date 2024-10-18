import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");

    const fishSupply = await prisma.fishSupply.findMany({
      include: { creator: { include: { hatchery: true } } },
    });
    return new NextResponse(
      JSON.stringify({
        status: true,
        data: fishSupply,
      })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    console.log(body);

    if (!body.organisation || !body.fishFarm) {
      return new NextResponse(
        JSON.stringify({
          message: "Fish farm or organisation missing",
          status: false,
        }),
        {
          status: 404,
        }
      );
    }

    const isHatcheryExist = await prisma.organisation.findUnique({
      where: { id: body.organisation },
    });
    if (!isHatcheryExist) {
      return new NextResponse(
        JSON.stringify({
          message: "Hatchery not found",
          status: false,
        }),
        {
          status: 404,
        }
      );
    }
    const isFarmExist = await prisma.farm.findUnique({
      where: { id: body.fishFarm },
    });

    if (!isFarmExist) {
      return new NextResponse(
        JSON.stringify({
          message: "farm not found",
          status: false,
        }),
        {
          status: 404,
        }
      );
    }
    const fishSupplyData = { ...body, createdBy: isHatcheryExist.id };
    const newFishSupply = await prisma.fishSupply.create({
      data: fishSupplyData,
    });
    return new NextResponse(
      JSON.stringify({
        data: newFishSupply,
        message: "Fish Supply Created Successfully",
        status: true,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
