import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type ProductionUnitInput = {
  name: string;
  type: string;
  capacity: string;
  waterflowRate: string;
};

type FeedProfileUnit = {
  unitName: string;
  feedProfile: string;
};

type ProductionParameterUnit = {
  unitName: string;
  predictedValues: Record<string, Record<number, string>>;
  idealRange: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const {
      productionParameter,
      farmAddress,
      productionUnits,
      feedProfile,
      name,
      organisationId,
      userId,
      fishFarmer,
      lat,
      lng,
      farmAltitude,
      mangerId,
      productionParamtertsUnitsArray,
      FeedProfileUnits,
    } = body;

    if (
      !productionParameter ||
      !farmAddress ||
      !productionUnits ||
      !feedProfile
    ) {
      return NextResponse.json(
        {
          status: false,
          message: 'All required payloads are missing or invalid',
        },
        { status: 404 },
      );
    }

    // Check if farm already exists with the same name
    const farmExistWithName = await prisma.farm.findUnique({
      where: { name, organisationId },
    });

    if (farmExistWithName) {
      return NextResponse.json(
        {
          status: false,
          message: `A farm named "${name}" already exists. Please use a different name.`,
        },
        { status: 409 },
      );
    }

    // Create farm address
    const newFarmAddress = await prisma.farmAddress.create({
      data: { ...farmAddress },
    });

    // Create farm
    const farm = await prisma.farm.create({
      data: {
        farmAddressId: newFarmAddress.id,
        name,
        farmAltitude,
        fishFarmer,
        lat,
        lng,
        organisationId,
        userId,
      },
    });

    // Create farm managers
    if (mangerId?.length) {
      await prisma.farmManger.createMany({
        data: mangerId.map((id: string) => ({
          farmId: farm.id,
          userId: Number(id),
        })),
      });
    }

    // Create production units
    const newProductUnits: { id: string; name: string }[] = [];

    for (const unit of productionUnits as ProductionUnitInput[]) {
      const newUnit = await prisma.productionUnit.create({
        data: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: farm.id,
        },
      });
      newProductUnits.push(newUnit);
    }

    // Create predicted water quality parameters
    const predictionPayload = {
      ...productionParameter.predictedValues,
      idealRange: productionParameter.idealRange,
    };

    await prisma.waterQualityPredictedParameters.create({
      data: {
        farmId: farm.id,
        YearBasedPredication: { create: predictionPayload },
      },
    });

    // Create per-unit water quality predictions
    await prisma.yearBasedPredicationProductionUnit.createMany({
      data: newProductUnits.flatMap((unit) =>
        (productionParamtertsUnitsArray as ProductionParameterUnit[])
          .map((param) =>
            unit.name === param.unitName
              ? {
                  productionUnitId: unit.id,
                  ...param.predictedValues,
                  idealRange: param.idealRange,
                }
              : null,
          )
          .filter(
            (entry): entry is Exclude<typeof entry, null> => entry !== null,
          ),
      ),
    });

    // Create feed profile
    await prisma.feedProfile.create({
      data: {
        farmId: farm.id,
        profiles: feedProfile,
      },
    });

    // Create per-unit feed profiles
    if (FeedProfileUnits) {
      await prisma.feedProfileProductionUnit.createMany({
        data: newProductUnits.flatMap((unit) =>
          (FeedProfileUnits as FeedProfileUnit[])
            .map((profile) =>
              unit.name === profile.unitName
                ? {
                    productionUnitId: unit.id,
                    profiles: profile.feedProfile,
                  }
                : null,
            )
            .filter(
              (entry): entry is Exclude<typeof entry, null> => entry !== null,
            ),
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

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      errorMessage = `Farm with name "${body.name}" already exists.`;
      statusCode = 409;
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
