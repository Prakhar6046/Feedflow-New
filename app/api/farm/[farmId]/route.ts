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
    // Get user ID from verified token (user is the decoded JWT token)
    const userId = (user as any)?.id || (user as any)?.userId;
    
    // Check if user is a General worker (level 1 or 2)
    const isGeneralWorker = (user as any)?.role === 'General worker (level 1)' || (user as any)?.role === 'General worker (level 2)';

    // If user is a General worker, get their assigned production unit IDs
    let assignedProductionUnitIds: string[] = [];
    if (isGeneralWorker && userId) {
      const workerAssignments = await prisma.productionUnitWorker.findMany({
        where: { userId: Number(userId) },
        select: { productionUnitId: true },
      });
      assignedProductionUnitIds = workerAssignments.map((a) => a.productionUnitId);
    }

    // Fetch farm with related entities
    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      include: {
        farmAddress: true,
        organisation: true,
        productionUnits: {
          include: {
            YearBasedPredicationProductionUnit: true,
            FeedProfileProductionUnit: true,
            productionSystem: true,
            ProductionUnitWorker: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
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

    // For General workers, check if they have access to this farm
    if (isGeneralWorker && assignedProductionUnitIds.length > 0) {
      const hasAccess = farm.productionUnits.some((unit: any) =>
        assignedProductionUnitIds.includes(unit.id)
      );
      if (!hasAccess) {
        return new NextResponse(
          JSON.stringify({ status: false, message: 'Access denied. You are not assigned to any production units in this farm.' }),
          { status: 403 },
        );
      }
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

    // Map production units to include allocatedWorkers array
    // For General workers, only show production units they are assigned to
    let productionUnitsWithWorkers = farm.productionUnits.map((unit: any) => ({
      ...unit,
      allocatedWorkers: unit.ProductionUnitWorker?.map((pw: any) => pw.userId) || [],
    }));

    if (isGeneralWorker && assignedProductionUnitIds.length > 0) {
      productionUnitsWithWorkers = productionUnitsWithWorkers.filter((unit: any) =>
        assignedProductionUnitIds.includes(unit.id)
      );
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: {
          ...farm,
          productionUnits: productionUnitsWithWorkers,
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
  try {
    const user = await verifyAndRefreshToken(request);

    if (!user || user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        {
          status: false,
          message: 'Forbidden: Only SUPERADMIN can delete farms',
        },
        { status: 403 },
      );
    }

    const farmId = context.params.farmId;
    if (!farmId) {
      return NextResponse.json(
        { status: false, message: 'Invalid or missing farmId' },
        { status: 400 },
      );
    }

    const farm = await prisma.farm.findUnique({ where: { id: farmId } });
    if (!farm) {
      return NextResponse.json(
        { status: false, message: 'Farm not found' },
        { status: 404 },
      );
    }

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

    const waterQualityIds = (
      await prisma.waterQualityPredictedParameters.findMany({
        where: { farmId },
        select: { id: true },
      })
    ).map((wq) => wq.id);

    // Delete feed profile production units
    if (productionUnitIds.length > 0) {
      await prisma.feedProfileProductionUnit.deleteMany({
        where: { 
          productionUnitId: { 
            in: productionUnitIds 
          } 
        },
      });
    }

    // Delete year based prediction production units
    if (productionUnitIds.length > 0) {
      await prisma.yearBasedPredicationProductionUnit.deleteMany({
        where: { productionUnitId: { in: productionUnitIds } },
      });
    }

    // Delete feed profile related data
    if (feedProfileIds.length > 0) {
      await prisma.feedProfileLink.deleteMany({
        where: { feedProfileId: { in: feedProfileIds } },
      });
      await prisma.feedProfile.deleteMany({ where: { id: { in: feedProfileIds } } });
    }

    // Delete water quality related data
    if (waterQualityIds.length > 0) {
      await prisma.yearBasedPredication.deleteMany({
        where: { waterQualityPredictedParameterId: { in: waterQualityIds } },
      });
    }
    await prisma.waterQualityPredictedParameters.deleteMany({ where: { farmId } });

    // Delete fish / production data
    await prisma.fishManageHistory.deleteMany({ where: { fishFarmId: farmId } });
    await prisma.fishSupply.deleteMany({ where: { fishFarmId: farmId } });
    
    // Delete production records before deleting production units
    if (productionUnitIds.length > 0) {
      await prisma.production.deleteMany({
        where: { productionUnitId: { in: productionUnitIds } },
      });
      
      await prisma.productionUnit.deleteMany({
        where: { id: { in: productionUnitIds } },
      });
    }

    // Delete growth models, managers, addresses
    await prisma.growthModelFarm.deleteMany({ where: { farmId } });
    await prisma.farmManger.deleteMany({ where: { farmId } });
    await prisma.farmAddress.deleteMany({ where: { id: farm.farmAddressId } });

    // Finally delete the farm
    await prisma.farm.delete({ where: { id: farmId } });

    return NextResponse.json({
      status: true,
      message: 'Farm and all related data deleted successfully',
    });
  } catch (error: any) {
    console.error('[FARM_DELETE_ERROR]', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 },
    );
  }
};
