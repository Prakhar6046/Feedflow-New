import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  try {
    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
        productionUnits: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by createdAt in descending order
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data: farms }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
