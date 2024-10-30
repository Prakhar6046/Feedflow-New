import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  const organisationId = searchParams.get("organisationId");
  const query = searchParams.get("query");
  const filter = searchParams.get("filter");

  try {
    const farmManaers = await prisma.farmManager.findMany({
      include: { farm: true, organisation: true },
      orderBy: {
        createdAt: "desc", // Sort by createdAt in descending order
      },
      where: {
        ...(filter === "true"
          ? {}
          : role !== "SUPERADMIN" && organisationId
          ? { organisationId: Number(organisationId) }
          : {}),

        AND: [
          query
            ? {
                OR: [
                  {
                    biomass: { contains: query, mode: "insensitive" },
                  },
                  {
                    count: { contains: query, mode: "insensitive" },
                  },
                  {
                    meanWeight: { contains: query, mode: "insensitive" },
                  },
                  {
                    stocked: { contains: query, mode: "insensitive" },
                  },
                ],
              }
            : {},
        ],
      },
    });
    return new NextResponse(
      JSON.stringify({ status: true, data: farmManaers }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const farm = await prisma.farm.findUnique({
      where: { id: body.fishFarmId },
    });
    if (!farm) {
      return NextResponse.json({
        message: "Invaild or missing farm",
        status: false,
      });
    }

    const newFarmManager = await prisma.farmManager.create({
      data: {
        fishFarmId: body.fishFarmId,
        productionUnitId: body.productionUnitId,
        count: body.count,
        currentBatch: body.currentBatch,
        biomass: body.biomass,
        meanWeight: body.meanWeight,
        stocked: body.stocked,
        organisationId: body.organisationId,
      },
    });
    return NextResponse.json({
      message: "Unit created successfully",
      data: newFarmManager,
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
