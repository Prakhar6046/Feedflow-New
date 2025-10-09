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

export const DELETE = async (
  request: NextRequest,
  context: { params: any },
) => {
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

  if (user.role !== 'SUPERADMIN') {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: 'Forbidden: Only SUPERADMIN can delete farms',
      }),
      { status: 403 },
    );
  }

  const farmId = context.params.farmId;
  if (!farmId) {
    return new NextResponse(
      JSON.stringify({ status: false, message: 'Invalid or missing farmId' }),
      { status: 400 },
    );
  }

  try {
    const farm = await prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return new NextResponse(
        JSON.stringify({ status: false, message: 'Farm not found' }),
        { status: 404 },
      );
    }

    // Delete related data
    const productionUnitIds = (
      await prisma.productionUnit.findMany({
        where: { farmId },
        select: { id: true },
      })
    ).map((pu) => pu.id);

    const feedProfileIds = (
      await prisma.feedProfile.findMany({
        where: { farmId },
        select: { id: true },
      })
    ).map((fp) => fp.id);

    await prisma.$transaction([
      prisma.feedProfileProductionUnit.deleteMany({
        where: { productionUnitId: { in: productionUnitIds } },
      }),
      prisma.yearBasedPredicationProductionUnit.deleteMany({
        where: { productionUnitId: { in: productionUnitIds } },
      }),
      prisma.feedProfileLink.deleteMany({
        where: { feedProfileId: { in: feedProfileIds } },
      }),
      prisma.feedProfile.deleteMany({ where: { id: { in: feedProfileIds } } }),
      prisma.waterQualityPredictedParameters.deleteMany({ where: { farmId } }),
      prisma.fishManageHistory.deleteMany({ where: { fishFarmId: farmId } }),
      prisma.fishSupply.deleteMany({ where: { fishFarmId: farmId } }),
      prisma.productionUnit.deleteMany({
        where: { id: { in: productionUnitIds } },
      }),
      prisma.growthModelFarm.deleteMany({ where: { farmId } }),
      prisma.farmManger.deleteMany({ where: { farmId } }),
      prisma.farmAddress.deleteMany({ where: { id: farm.farmAddressId } }),
      prisma.farm.delete({ where: { id: farmId } }),
    ]);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'Farm and all related data deleted successfully',
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error('[FARM_DELETE_ERROR]', error);
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: 'Internal server error',
        error: error.message,
      }),
      { status: 500 },
    );
  }
};
