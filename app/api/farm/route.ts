import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
        productionUnits: true,
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
