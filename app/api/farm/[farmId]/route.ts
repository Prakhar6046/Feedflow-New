import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

export const GET = async (request: NextRequest, context: { params: any }) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: 'Unauthorized: Token missing or invalid',
      }),
      { status: 401 },
    );
  }

  const farmId = context.params.farmId;

  if (!farmId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing farmId' }),
      { status: 400 },
    );
  }

  try {
    // Fetch farm with related entities
    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      include: {
        farmAddress: true,
        productionUnits: {
          include: {
            YearBasedPredicationProductionUnit: true,
            FeedProfileProductionUnit: true,
            productionSystem: true,
          },
        },
        production: true,
        FishManageHistory: {
          include: {
            FishSupply: true, 
          },
        },
        FeedProfile: true,
        FarmManger: true,
        WaterQualityPredictedParameters: {
          include: { YearBasedPredication: true },
        },
      },
    });

    if (!farm) {
      return new NextResponse(
        JSON.stringify({ status: false, message: 'Farm not found' }),
        { status: 404 },
      );
    }

    // Extract all unique userIds from FarmManger
    const userIds = farm.FarmManger.map((m) => m.userId).filter(Boolean);

    // Fetch user details
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: {
        id: true,
        name: true,
        email: true,
        // mobileNumber: true,
        role: true,
        // designation: true,
      },
    });

    // Map user details back to FarmManger
    const managersWithUserData = farm.FarmManger.map((manager) => ({
      ...manager,
      user: users.find((u) => u.id === manager.userId) || null,
    }));

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: {
          ...farm,
          FarmManger: managersWithUserData,
        },
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error('[FARM_FETCH_ERROR]', error);
    return new NextResponse(
      JSON.stringify({ status: false, error: 'Internal server error' }),
      { status: 500 },
    );
  }
};
