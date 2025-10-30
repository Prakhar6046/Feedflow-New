import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
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

export async function POST(request: NextRequest) {
  const body = await request.json();
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
      managerId,
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

    // Validate farm address required fields
    if (!farmAddress.addressLine1 || !farmAddress.city || !farmAddress.province || !farmAddress.zipCode || !farmAddress.country) {
      return NextResponse.json(
        {
          status: false,
          message: 'Farm address is missing required fields (addressLine1, city, province, zipCode, country)',
        },
        { status: 400 },
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

    // Create farm addres
    let newFarmAddress;
    try {
      newFarmAddress = await prisma.farmAddress.create({
        data: { 
          addressLine1: farmAddress.addressLine1,
          addressLine2: farmAddress.addressLine2 || null,
          city: farmAddress.city,
          province: farmAddress.province,
          zipCode: farmAddress.zipCode,
          country: farmAddress.country,
        },
      });
    } catch (addressError) {
      console.error('Error creating farm address:', addressError);
      return NextResponse.json(
        {
          status: false,
          message: 'Failed to create farm address',
          error: addressError instanceof Error ? addressError.message : 'Unknown error',
        },
        { status: 500 },
      );
    }
    // Create farm
    let farm;
    try {
      farm = await prisma.farm.create({
        data: {
          farmAddressId: newFarmAddress.id,
          fishFarmerId: Number(fishFarmer),
          name,
          farmAltitude,
          fishFarmer,
          lat,
          lng,
          organisationId,
          userId,
        },
      });
    } catch (farmError) {
      console.error('Error creating farm:', farmError);
      // Clean up the created address if farm creation fails
      try {
        await prisma.farmAddress.delete({ where: { id: newFarmAddress.id } });
      } catch (cleanupError) {
        console.error('Error cleaning up farm address:', cleanupError);
      }
      return NextResponse.json(
        {
          status: false,
          message: 'Failed to create farm',
          error: farmError instanceof Error ? farmError.message : 'Unknown error',
        },
        { status: 500 },
      );
    }
    // Create farm managers from contact IDs by resolving to user IDs
    if (Array.isArray(managerId) && managerId.length > 0) {
      const filteredContactIds = managerId
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

    const feedProfileProductionUnitData = FeedProfileUnits.map(
      (unitProfile) => {
        const matchedUnit = newProductUnits.find(
          (unit) => unit.name === unitProfile.unitName,
        );
        if (matchedUnit) {
          return {
            productionUnitId: matchedUnit.id,
            feedProfileId: newFeedProfile.id,
            profiles: unitProfile.feedProfile,
          };
        }
        return null;
      },
    ).filter(Boolean);

    if (feedProfileProductionUnitData.length > 0) {
      await prisma.feedProfileProductionUnit.createMany({
        data: feedProfileProductionUnitData as any,
      });
    }

    // If overrides provided, update them
    if (FeedProfileUnits && Array.isArray(FeedProfileUnits)) {
      for (const profile of FeedProfileUnits) {
        const unit = newProductUnits.find((u) => u.name === profile.unitName);
        if (unit) {
          await prisma.feedProfileProductionUnit.updateMany({
            where: {
              productionUnitId: unit.id,
              feedProfileId: newFeedProfile.id,
            },
            data: {
              profiles: profile.feedProfile,
            },
          });
        }
      }
    }
    // Create feed profile links based on supplier organisations
    if (Array.isArray(feedProfile)) {
      for (const fp of feedProfile) {
        // Find store
        const store = await prisma.feedStore.findUnique({
          where: { id: fp.storeId },
        });
        if (!store) continue;

        // Find supplier organisation
        const supplierOrg = await prisma.organisation.findUnique({
          where: { id: fp.supplierId },
        });
        if (!supplierOrg || supplierOrg.organisationType !== 'Feed Supplier') {
          console.log(
            `Organisation ID ${fp.supplierId} is not a feed supplier, skipping...`,
          );
          continue;
        }

        const minFishSize = fp.minFishSize ?? store.minFishSizeG;
        const maxFishSize = fp.maxFishSize ?? store.maxFishSizeG;

        await prisma.feedProfileLink.upsert({
          where: {
            feedProfileId_feedSupplyId_feedStoreId: {
              feedProfileId: newFeedProfile.id,
              feedSupplyId: supplierOrg.id,
              feedStoreId: store.id,
            },
          },
          update: { minFishSize, maxFishSize },
          create: {
            feedProfileId: newFeedProfile.id,
            feedSupplyId: supplierOrg.id,
            feedStoreId: store.id,
            minFishSize,
            maxFishSize,
          },
        });
      }
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
