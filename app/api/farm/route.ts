import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, response: NextResponse) => {
  try {
    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
        productionUnits: true,
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data: farms }), {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
};
