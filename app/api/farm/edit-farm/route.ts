import prisma from '@/prisma/prisma';
import { ProductionUnit } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { yearBasedPredicationId, modelId, ...productionParameterPayload } =
      body.productionParameter;

    // Ensure that the farmAddress contains an id for updating
    if (!body.farmAddress.id) {
      throw new Error('Farm address ID is required for updating.');
    }
    if (!yearBasedPredicationId) {
      throw new Error('Year Based Predication ID is required for updating.');
    }

    // const productionParameter = body.productionParameter;
    const paylaodForProductionParameter = {
      ...productionParameterPayload.predictedValues,
      idealRange: productionParameterPayload.idealRange,
      modelId,
    };
    // Update the existing farm address
    const updatedFarmAddress = await prisma.farmAddress.update({
      where: { id: body.farmAddress.id },
      data: { ...body.farmAddress },
    });

    // Update the existing farm
    const updatedFarm = await prisma.farm.update({
      where: { id: body.id },
      data: {
        farmAddressId: updatedFarmAddress.id,
        name: body.name,
        farmAltitude: body.farmAltitude,
        lat: body.lat,
        lng: body.lng,
      },
    });

    //updating existing farm manager

    // Fetch existing production units and productions from the database
    const existingUnits = await prisma.productionUnit.findMany({
      where: { farmId: updatedFarm.id },
      include: { YearBasedPredicationProductionUnit: true },
    });

    // const existingProductions = await prisma.production.findMany({
    //   where: { fishFarmId: updatedFarm.id },
    // });

    // Prepare a list of unit ids from the request body for comparison
    const unitIds = body.productionUnits.map((unit: ProductionUnit) => unit.id);

    const newUnits = [];
    const newProductions = [];

    // Upsert (create or update) production units and corresponding production entries
    for (const unit of body.productionUnits) {
      const updatedUnit = await prisma.productionUnit.upsert({
        where: { id: unit.id || '' }, // If no id, create a new entry
        update: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: updatedFarm.id,
        },
        create: {
          name: unit.name,
          type: unit.type,
          capacity: unit.capacity,
          waterflowRate: unit.waterflowRate,
          farmId: updatedFarm.id,
        },
      });
      newUnits.push(updatedUnit); // Store the updated or created production unit

      for (const existingPredictionUnit of body.productionParamtertsUnitsArray ||
        []) {
        if (unit.name === existingPredictionUnit.unitName) {
          const { id, idealRange, ...rest } = existingPredictionUnit;
          delete existingPredictionUnit.unitName;
          await prisma.yearBasedPredicationProductionUnit.upsert({
            where: { id: id || '', productionUnitId: unit.id || '' },
            update: {
              ...rest.predictedValues,
              idealRange,
            },
            create: {
              productionUnitId: updatedUnit.id,
              ...(rest.predictedValues && idealRange
                ? { ...rest.predictedValues, idealRange }
                : { ...paylaodForProductionParameter }),
            },
          });
        }
      }

      for (const existingPredictionUnit of body.FeedProfileUnits || []) {
        if (unit.name === existingPredictionUnit.unitName) {
          const { id, feedProfile } = existingPredictionUnit;

          if (id) {
            // ✅ If id exists, update
            await prisma.feedProfileProductionUnit.update({
              where: { id },
              data: {
                profiles: feedProfile,
              },
            });
          } else {
            // ✅ If id doesn't exist, create
            await prisma.feedProfileProductionUnit.create({
              data: {
                productionUnitId: updatedUnit.id,
                profiles: feedProfile,
              },
            });
          }
        }
      }

      // Handle production entries corresponding to the production unit
      const correspondingProduction = body.productions.find(
        (p: { productionUnitId?: number }) => p.productionUnitId === unit.id,
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
      // Delete related production records first
      await prisma.production.deleteMany({
        where: { productionUnitId: unit.id },
      });

      unit.YearBasedPredicationProductionUnit.map(async (data) => {
        await prisma.yearBasedPredicationProductionUnit.delete({
          where: { id: data.id },
        });
      });
      await prisma.feedProfileProductionUnit.deleteMany({
        where: { productionUnitId: unit.id },
      });
      await prisma.productionUnit.delete({
        where: { id: unit.id },
      });
    }

    const existingPredication = await prisma.yearBasedPredication.findUnique({
      where: { id: yearBasedPredicationId },
    });

    if (!existingPredication) {
      throw new Error(
        `Year Based Predication record with ID ${yearBasedPredicationId} not found.`,
      );
    }
    // const updateProductionPredection = await prisma.yearBasedPredication.update(
    //   {
    //     where: { id: yearBasedPredicationId },
    //     data: { ...paylaodForProductionParameter },
    //   },
    // );

    //update feedProfile
    await prisma.feedProfile.update({
      where: { id: body.feedProfileId },
      data: { profiles: body.feedProfile },
    });
    return NextResponse.json({
      message: 'Farm updated successfully',
      data: updatedFarm,
      status: true,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
