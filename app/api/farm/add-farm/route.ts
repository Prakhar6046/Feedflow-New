import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

type ProductionUnitInput = {
  name: string;
  type: string;
  productionSystem: string;
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

    // Create farm managers from contact IDs by resolving to user IDs
    if (Array.isArray(mangerId) && mangerId.length > 0) {
      const filteredContactIds = mangerId
        .filter((id: any) => !!id)
        .map((id: any) => String(id))
        .filter((id: string) => id.trim().length > 0);

      if (filteredContactIds.length > 0) {
        const contactData = await prisma.contact.findMany({
          where: {
            id: {
              in: filteredContactIds,
            },
          },
          select: {
            id: true,
            userId: true,
          },
        });

        // Only use contacts with a valid userId (not 1 or null)
        const managerEntries = contactData
          .filter((contact) => contact.userId && contact.userId !== 1)
          .map((contact) => ({
            farmId: farm.id,
            userId: contact.userId,
          }));

        if (managerEntries.length > 0) {
          await prisma.farmManger.createMany({
            data: managerEntries,
          });
        }
      }
    }


    // Create production units
    const newProductUnits: { id: string; name: string }[] = [];

    for (const unit of productionUnits as ProductionUnitInput[]) {
      const newUnit = await prisma.productionUnit.create({
        data: {
          name: unit.name,
          type: unit.type,
          productionSystemId: unit.productionSystem,
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
    const newFeedProfile = await prisma.feedProfile.create({
      data: {
        farmId: farm.id,
        profiles: feedProfile,
      },
    });

    // Create per-unit feed profiles
    if (FeedProfileUnits && Array.isArray(FeedProfileUnits)) {
      await prisma.feedProfileProductionUnit.createMany({
        data: newProductUnits
          .flatMap((unit) =>
            (FeedProfileUnits)
              .filter(profile => profile.unitName === unit.name)
              .map(profile => ({
                productionUnitId: unit.id,
                profiles: profile.feedProfile,
              }))
          ),
      });
    }
    if (body.supplierId && body.storeId) {
      const supplier = await prisma.feedSupply.findUnique({
        where: { id: String(body.supplierId) },
      });

      const store = await prisma.feedStore.findUnique({
        where: { id: String(body.storeId) },
      });

      const clonedStore = await prisma.feedStore.create({
        data: {
          ...store,
          id: undefined as any,
          minFishSizeG: body.minFishSize ?? store.minFishSizeG,
          maxFishSizeG: body.maxFishSize ?? store.maxFishSizeG,
        },
      });

      await prisma.feedProfileLink.create({
        data: {
          feedProfileId: newFeedProfile.id,
          feedSupplyId: supplier.id,
          feedStoreId: clonedStore.id,
          minFishSize: body.minFishSize,
          maxFishSize: body.maxFishSize,
        },
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
