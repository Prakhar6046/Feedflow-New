import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAndRefreshToken } from "@/app/_lib/auth/verifyAndRefreshToken";

export const GET = async (request: NextRequest, context: { params: any }) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: "Unauthorized: Token missing or invalid",
      }),
      { status: 401 }
    );
  }
  const farmId = context.params.farmId;

  if (!farmId) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid or missing farmId" }),
      { status: 400 }
    );
  }
  try {
    const data = await prisma.farm.findUnique({
      where: { id: farmId },
      include: {
        farmAddress: true,
        productionUnits: {
          include: {
            YearBasedPredicationProductionUnit: true,
            FeedProfileProductionUnit: true,
          },
        },
        production: true,
        FeedProfile: true,
        FarmManger: true,
        WaterQualityPredictedParameters: {
          include: { YearBasedPredication: true },
        },
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
