import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAndRefreshToken(req);
    if (user.status === 401) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: 'Unauthorized: Token missing or invalid',
        }),
        { status: 401 },
      );
    }
    const body = await req.json();
    console.log('Received payload for updating farm:', body);
    const { yearBasedPredicationId, modelId, ...productionParameterPayload } =
      body.productionParameter;

    // Ensure that the farmAddress contains an id for updating
    // if (!body.farmAddress.id) {
    //   throw new Error('Farm address ID is required for updating.');
    // }
    if (!yearBasedPredicationId) {
      throw new Error('Year Based Predication ID is required for updating.');
    }

    // const productionParameter = body.productionParameter;
    const paylaodForProductionParameter = {
      ...productionParameterPayload.predictedValues,
      idealRange: productionParameterPayload.idealRange,
      modelId,
    };
    // Validate farm address data
    if (!body.farmAddress) {
      throw new Error('Farm address data is required for updating farm.');
    }

    // Validate required fields
    if (!body.farmAddress.addressLine1 || !body.farmAddress.city || !body.farmAddress.province || !body.farmAddress.zipCode || !body.farmAddress.country) {
      throw new Error('Farm address is missing required fields (addressLine1, city, province, zipCode, country)');
    }

    // Update the existing farm address
    let farmAddressId = body.farmAddress?.id;
    console.log('Farm Address Data for Edit:', body.farmAddress);
    console.log('Farm Address ID from frontend:', farmAddressId);

    // First, get the current farm to check if it has an existing address
    const currentFarm = await prisma.farm.findUnique({
      where: { id: body.id },
      include: { farmAddress: true }
    });
    console.log('Current farm with address:', currentFarm);

    if (!farmAddressId) {
      // If no ID provided, check if farm already has an address
      if (currentFarm?.farmAddress) {
        // Update existing address
        farmAddressId = currentFarm.farmAddress.id;
        try {
          await prisma.farmAddress.update({
            where: { id: farmAddressId },
            data: {
              addressLine1: body.farmAddress.addressLine1,
              addressLine2: body.farmAddress.addressLine2 || null,
              city: body.farmAddress.city,
              province: body.farmAddress.province,
              zipCode: body.farmAddress.zipCode,
              country: body.farmAddress.country,
            },
          });
          console.log('Updated existing farm address (no ID provided):', farmAddressId);
        } catch (addressError) {
          console.error('Error updating existing farm address:', addressError);
          throw new Error('Failed to update existing farm address: ' + (addressError instanceof Error ? addressError.message : 'Unknown error'));
        }
      } else {
        // Create new farm address if no existing address
        try {
          const newFarmAddress = await prisma.farmAddress.create({
            data: {
              addressLine1: body.farmAddress.addressLine1,
              addressLine2: body.farmAddress.addressLine2 || null,
              city: body.farmAddress.city,
              province: body.farmAddress.province,
              zipCode: body.farmAddress.zipCode,
              country: body.farmAddress.country,
            },
          });
          farmAddressId = newFarmAddress.id;
          console.log('Created new farm address (no existing address):', newFarmAddress);
        } catch (addressError) {
          console.error('Error creating farm address:', addressError);
          throw new Error('Failed to create farm address: ' + (addressError instanceof Error ? addressError.message : 'Unknown error'));
        }
      }
    } else {
      // Update existing farm address safely
      try {
        const existingAddress = await prisma.farmAddress.findUnique({
          where: { id: farmAddressId },
        });

        if (!existingAddress) {
          // If address ID sent does not exist, create new
          const newFarmAddress = await prisma.farmAddress.create({
            data: {
              addressLine1: body.farmAddress.addressLine1,
              addressLine2: body.farmAddress.addressLine2 || null,
              city: body.farmAddress.city,
              province: body.farmAddress.province,
              zipCode: body.farmAddress.zipCode,
              country: body.farmAddress.country,
            },
          });
          farmAddressId = newFarmAddress.id;
          console.log('Created new farm address (ID not found):', newFarmAddress);
        } else {
          await prisma.farmAddress.update({
            where: { id: farmAddressId },
            data: {
              addressLine1: body.farmAddress.addressLine1,
              addressLine2: body.farmAddress.addressLine2 || null,
              city: body.farmAddress.city,
              province: body.farmAddress.province,
              zipCode: body.farmAddress.zipCode,
              country: body.farmAddress.country,
            },
          });
          console.log('Updated existing farm address:', farmAddressId);
        }
      } catch (addressError) {
        console.error('Error updating farm address:', addressError);
        throw new Error('Failed to update farm address: ' + (addressError instanceof Error ? addressError.message : 'Unknown error'));
      }
    }
    if (!body.id) {
      throw new Error('Farm ID is required to update a farm.');
    }

    // Update the existing farm
    let updatedFarm;
    try {
      console.log('Updating farm with farmAddressId:', farmAddressId);
      console.log('Farm update data:', {
        farmAddressId: farmAddressId,
        fishFarmerId: Number(body.fishFarmer),
        name: body.name,
        farmAltitude: body.farmAltitude,
        lat: body.lat,
        lng: body.lng,
      });
      
      updatedFarm = await prisma.farm.update({
        where: { id: body.id },
        data: {
          farmAddressId: farmAddressId,
          fishFarmerId: Number(body.fishFarmer),
          name: body.name,
          farmAltitude: body.farmAltitude,
          lat: body.lat,
          lng: body.lng,
        },
      });
      console.log('Updated farm:', updatedFarm);
      
      // Verify the farm address relationship after update
      const farmWithAddress = await prisma.farm.findUnique({
        where: { id: body.id },
        include: { farmAddress: true }
      });
      console.log('Farm with address after update:', farmWithAddress);
    } catch (farmError) {
      console.error('Error updating farm:', farmError);
      throw new Error('Failed to update farm: ' + (farmError instanceof Error ? farmError.message : 'Unknown error'));
    }

    //updating existing farm manager
    if (Array.isArray(body.managerId)) {
      await prisma.farmManger.deleteMany({
        where: { farmId: updatedFarm.id },
      });

      const filteredContactIds = body.managerId
        .filter((id: any) => !!id)
        .map((id: any) => String(id).trim());

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
          farmId: updatedFarm.id,
          userId: contact.userId,
        }));

      if (managerEntries.length > 0) {
        await prisma.farmManger.createMany({
          data: managerEntries,
        });
      }
    }
    // Fetch existing production units and productions from the database
    const existingUnits = await prisma.productionUnit.findMany({
      where: { farmId: updatedFarm.id },
      include: {
        YearBasedPredicationProductionUnit: true,
        FeedProfileProductionUnit: true,
      },
    });

    const existingProductions = await prisma.production.findMany({
      where: { fishFarmId: updatedFarm.id },
    });

    // Prepare a list of unit ids from the request body for comparison
    const unitIds = body.productionUnits.map((unit: any) => unit.id);

    const newUnits = [];
    const newProductions = [];

    // Upsert (create or update) production units and corresponding production entries
    for (const unit of body.productionUnits) {
      const updatedUnit = await prisma.productionUnit.upsert({
        where: { id: unit.id || '' }, // If no id, create a new entry
        update: {
          name: unit.name,
          type: unit.type,
          productionSystemId: unit.productionSystem,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: updatedFarm.id,
        },
        create: {
          name: unit.name,
          type: unit.type,
          productionSystemId: unit.productionSystem,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: updatedFarm.id,
        },
      });
      newUnits.push(updatedUnit); // Store the updated or created production unit

      for (const existingPredictionUnit of body.productionParamtertsUnitsArray ||
        []) {
        if (unit.name === existingPredictionUnit.unitName) {
          const { id, unitName, idealRange, ...rest } = existingPredictionUnit;
          await prisma.yearBasedPredicationProductionUnit.upsert({
            where: { id: id || '', productionUnitId: unit.id || '' },
            update: { ...rest.predictedValues, idealRange },
            create: {
              productionUnitId: updatedUnit.id,
              ...(rest.predictedValues && idealRange
                ? { ...rest.predictedValues, idealRange }
                : { ...paylaodForProductionParameter }),
            },
          });
        }
      }

      if (body.FeedProfileUnits && Array.isArray(body.FeedProfileUnits)) {
        for (const unitProfile of body.FeedProfileUnits) {
          // Find the newly created or updated production unit to get its ID
          const matchedProductionUnit = existingUnits.find(
            (u) => u.name === unitProfile.unitName,
          );

          if (matchedProductionUnit) {
            // Find if a feed profile link already exists for this unit
            const existingFeedUnit =
              matchedProductionUnit.FeedProfileProductionUnit.find(
                (fpu) => fpu.feedProfileId === body.feedProfileId,
              );

            if (existingFeedUnit) {
              // Update the existing record if it exists
              await prisma.feedProfileProductionUnit.update({
                where: { id: existingFeedUnit.id },
                data: { profiles: unitProfile.feedProfile },
              });
            } else {
              // Create a new record if it doesn't exist
              await prisma.feedProfileProductionUnit.create({
                data: {
                  productionUnitId: matchedProductionUnit.id,
                  feedProfileId: body.feedProfileId,
                  profiles: unitProfile.feedProfile,
                },
              });
            }
          }
        }
      }

      // Handle production entries corresponding to the production unit
      const correspondingProduction = body.productions.find(
        (p: any) => p.productionUnitId === unit.id,
      );

      // Create or update production based on whether it's found or not
      if (correspondingProduction) {
        // Update existing production
        const updatedProduction = await prisma.production.update({
          where: { id: correspondingProduction.id },
          data: {
            fishFarmId: updatedFarm.id,
            productionUnitId: updatedUnit.id, // Link to the newly updated production unit ID
            organisationId: body.organisationId,
            biomass: correspondingProduction.biomass,
            fishCount: correspondingProduction.fishCount,
            batchNumberId: correspondingProduction.batchNumberId,
            age: correspondingProduction.age,
            meanLength: correspondingProduction.meanLength,
            meanWeight: correspondingProduction.meanWeight,
            stockingDensityKG: correspondingProduction.stockingDensityKG,
            stockingDensityNM: correspondingProduction.stockingDensityNM,
            stockingLevel: correspondingProduction.stockingLevel,
            createdBy: correspondingProduction.createdBy,
            updatedBy: correspondingProduction.updatedBy,
          },
        });
        newProductions.push(updatedProduction); // Store the updated production entry
      } else {
        // Create new production if none exists for this unit
        const newProduction = await prisma.production.create({
          data: {
            fishFarmId: updatedFarm.id,
            productionUnitId: updatedUnit.id,
            organisationId: body.organisationId,
            // Add default fields for production (optional or null values from payload)
            biomass: null,
            fishCount: null,
            batchNumberId: null,
            age: null,
            meanLength: null,
            meanWeight: null,
            stockingDensityKG: null,
            stockingDensityNM: null,
            stockingLevel: null,
            createdBy: null,
            updatedBy: null,
          },
        });
        newProductions.push(newProduction); // Store the newly created production
      }
    }

    // Delete units that are no longer present in the updated list
    const unitsToDelete = existingUnits.filter(
      (existingUnit) => !unitIds.includes(existingUnit.id),
    );

    for (const unit of unitsToDelete) {
      await prisma.production.deleteMany({
        where: { productionUnitId: unit.id },
      });

      for (const data of unit.YearBasedPredicationProductionUnit) {
        await prisma.yearBasedPredicationProductionUnit.delete({
          where: { id: data.id },
        });
      }

      await prisma.feedProfileProductionUnit.deleteMany({
        where: { productionUnitId: unit.id },
      });

      await prisma.productionUnit.delete({ where: { id: unit.id } });
    }

    const existingPredication = await prisma.yearBasedPredication.findUnique({
      where: { id: yearBasedPredicationId },
    });
    if (!existingPredication) {
      throw new Error(
        `Year Based Predication record with ID ${yearBasedPredicationId} not found.`,
      );
    }
    await prisma.yearBasedPredication.update({
      where: { id: yearBasedPredicationId },
      data: { ...paylaodForProductionParameter },
    });

    if (body.feedProfileId) {
      await prisma.feedProfile.update({
        where: { id: body.feedProfileId },
        data: { profiles: body.feedProfile },
      });
    }
    // 3. Update FeedProfileLink
    if (Array.isArray(body.feedProfile)) {
      for (const fp of body.feedProfile) {
        const store = await prisma.feedStore.findUnique({
          where: { id: fp.storeId },
        });
        if (!store) continue;
        // Check if the supplier organisation exists
        const supplierOrg = await prisma.organisation.findUnique({
          where: { id: fp.supplierId }, // directly Organisation ID
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
              feedProfileId: body.feedProfileId,
              feedSupplyId: supplierOrg.id,
              feedStoreId: store.id,
            },
          },
          update: { minFishSize, maxFishSize },
          create: {
            feedProfileId: body.feedProfileId,
            feedSupplyId: supplierOrg.id,
            feedStoreId: store.id,
            minFishSize,
            maxFishSize,
          },
        });
      }
    }
    return NextResponse.json({
      message: 'Farm updated successfully',
      data: updatedFarm,
      status: true,
    });
  } catch (error: any) {
    console.error('Error updating farm and production managers:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
