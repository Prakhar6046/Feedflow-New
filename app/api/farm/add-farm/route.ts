import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const productionParameter = body.productionParameter;
    if (
      !productionParameter ||
      !body.farmAddress ||
      !body.productionUnits ||
      !body.feedProfile
    ) {
      return NextResponse.json(
        {
          status: false,
          message: 'All required payload missing or invalid',
        },
        { status: 404 },
      );
    }

    // check farm name
    const farmExistWithName = await prisma.farm.findUnique({
      where: { name: body?.name, organisationId: body.organsationId },
    });
    if (farmExistWithName) {
      return NextResponse.json(
        {
          status: false,
          message: `A farm named "${body?.name}" already exists. Please use a different name.`,
        },
        { status: 409 },
      );
    }
    const newFarmAddress = await prisma.farmAddress.create({
      data: { ...body.farmAddress },
    });

    const farm = await prisma.farm.create({
      data: {
        farmAddressId: newFarmAddress.id,
        name: body.name,
        farmAltitude: body.farmAltitude,
        fishFarmer: body.fishFarmer,
        lat: body.lat,
        lng: body.lng,
        organisationId: body.organsationId,
        userId: body.userId,
      },
    });
    //Creating farm manager
    if (body?.mangerId?.length) {
      await prisma.farmManger.createMany({
        data: body.mangerId?.map((userId: string) => ({
          farmId: farm.id,
          userId: Number(userId),
        })),
      });
    }

    // Create production units one by one to retrieve their ids
    const newProductUnits = [];
    const newSamplingEnvironment = [];
    const newSamplingStock = [];

    for (const unit of body.productionUnits) {
      const newUnit = await prisma.productionUnit.create({
        data: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: farm.id,
          // Associate each production unit with the created farm
        },
      });
      newProductUnits.push(newUnit); // Store each created production unit
      newSamplingEnvironment.push(newUnit);
      newSamplingStock.push(newUnit);
    }

    // Create production managers using the ids of the created production units
    const newProductionManage = await prisma.production.createMany({
      data: newProductUnits?.map((unit: any) => ({
        fishFarmId: farm.id,
        productionUnitId: unit.id, // Use the production unit id
        organisationId: body.organsationId,
      })),
    });

    //Creating production parameter
    const paylaodForProductionParameter = {
      ...productionParameter.predictedValues,
      idealRange: productionParameter.idealRange,
    };

    await prisma.waterQualityPredictedParameters.create({
      data: {
        farmId: farm.id,
        YearBasedPredication: { create: { ...paylaodForProductionParameter } },
      },
    });

    await prisma.yearBasedPredicationProductionUnit.createMany({
      data: newProductUnits.flatMap((unit: any) =>
        body.productionParamtertsUnitsArray
          ?.map((data: any) => {
            if (unit.name === data.unitName) {
              return {
                productionUnitId: unit.id,
                ...data.predictedValues,
                idealRange: data.idealRange,
              };
            }
            return null;
          })
          .filter((entry: any) => entry !== null),
      ),
    });
    await prisma.feedProfile.create({
      data: {
        farmId: farm.id,
        profiles: body.feedProfile,
      },
    });

    if (body.FeedProfileUnits) {
      await prisma.feedProfileProductionUnit.createMany({
        data: newProductUnits.flatMap((unit: any) =>
          body.FeedProfileUnits?.map((data: any) => {
            if (unit.name === data.unitName) {
              return {
                productionUnitId: unit.id,
                profiles: data.feedProfile,
              };
            }
            return null;
          }).filter((entry: any) => entry !== null),
        ),
      });
    }

    return NextResponse.json({
      message: 'Farm created successfully',
      data: 'farm',
      status: true,
    });
  } catch (error: unknown) {
    console.error('Error:', error);

    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        errorMessage = `Farm with name "${body.name}" already exists.`;
        statusCode = 409;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object' && error !== null) {
      errorMessage = JSON.stringify(error);
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
