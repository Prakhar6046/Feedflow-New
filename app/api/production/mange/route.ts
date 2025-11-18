import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received body:', body);
    const dataArray = Array.isArray(body.data) ? body.data : [body.data];

    for (const data of dataArray) {
      const safeBatchNumber = data.batchNumber ? Number(data.batchNumber) : null;
      const field = data.field ?? '';

      // Helper function to parse numeric values safely
      const parseNumber = (value: string | undefined | null): number => {
        if (!value) return 0;
        const parsed = parseFloat(String(value));
        return isNaN(parsed) ? 0 : parsed;
      };

      // Helper function to calculate mean weight from biomass and count
      const calculateMeanWeight = (biomass: number, count: number): string => {
        if (count === 0) return '0';
        return (biomass / count).toFixed(2);
      };

      // Helper function to get production unit capacity for stocking density calculation
      const getProductionUnitCapacity = async (productionUnitId: string): Promise<number> => {
        const unit = await prisma.productionUnit.findUnique({
          where: { id: productionUnitId },
          select: { capacity: true },
        });
        return parseNumber(unit?.capacity);
      };

      if (field === 'Stock') {
        // For Stock: Add new stock to existing stock (supports multiple batches in one unit)
        // Find production record by production unit (not just by ID, to handle multiple batches)
        let currentProduction = null;
        
        if (data.id) {
          // Try to find by ID first
          currentProduction = await prisma.production.findUnique({
            where: { id: Number(data.id) },
          });
        }
        
        // If not found by ID, or if we want to find by unit (for multiple batches),
        // find the production record for this unit
        if (!currentProduction && data.productionUnit) {
          currentProduction = await prisma.production.findFirst({
            where: {
              productionUnitId: data.productionUnit,
              fishFarmId: data.fishFarm,
            },
            orderBy: {
              updatedAt: 'desc', // Get the most recent one
            },
          });
        }

        if (currentProduction) {
          // Calculate new totals by adding to existing values
          const currentBiomass = parseNumber(currentProduction.biomass);
          const currentFishCount = parseNumber(currentProduction.fishCount);
          const newBiomass = parseNumber(data.biomass);
          const newFishCount = parseNumber(data.count);

          const updatedBiomass = currentBiomass + newBiomass;
          const updatedFishCount = currentFishCount + newFishCount;
          const updatedMeanWeight = calculateMeanWeight(updatedBiomass, updatedFishCount);

          // Get production unit capacity for stocking density
          const capacity = await getProductionUnitCapacity(data.productionUnit);
          const updatedStockingDensityKG = capacity > 0 
            ? (updatedBiomass / capacity).toFixed(2) 
            : '0';
          const updatedStockingDensityNM = capacity > 0 
            ? (updatedFishCount / capacity).toFixed(2) 
            : '0';

          // Manage batchIds array - add new batch if it doesn't exist
          let batchIdsArray: number[] = [];
          if (currentProduction.batchIds) {
            try {
              batchIdsArray = Array.isArray(currentProduction.batchIds) 
                ? currentProduction.batchIds as number[]
                : JSON.parse(currentProduction.batchIds as string);
            } catch (e) {
              // If parsing fails, start with empty array
              batchIdsArray = [];
            }
          }
          
          // Add the new batch ID if it's not already in the array
          if (safeBatchNumber && !batchIdsArray.includes(safeBatchNumber)) {
            batchIdsArray.push(safeBatchNumber);
          }

          // Create history entry with the new stock values for THIS specific batch
          // This allows tracking which batch contributed what amount
          await prisma.fishManageHistory.create({
            data: {
              fishFarmId: data.fishFarm,
              productionUnitId: data.productionUnit,
              fishCount: data.count, // New stock count for this batch
              batchNumberId: safeBatchNumber, // Track which batch this is
              fishSupplyId: safeBatchNumber,
              biomass: data.biomass, // New stock biomass for this batch
              meanLength: data.meanLength || currentProduction.meanLength || '',
              meanWeight: data.meanWeight || calculateMeanWeight(newBiomass, newFishCount),
              stockingLevel: data.stockingLevel || currentProduction.stockingLevel || '',
              stockingDensityKG: data.stockingDensityKG || updatedStockingDensityKG,
              stockingDensityNM: data.stockingDensityNM || updatedStockingDensityNM,
              organisationId: body.organisationId ?? null,
              currentDate: data.currentDate,
              age: '',
              field: 'Stock',
              productionId: currentProduction.id, // Link to the production record
            },
          });

          // Update production with total accumulated values (across all batches)
          // Store all batch IDs in the batchIds array
          await prisma.production.update({
            where: { id: currentProduction.id },
            data: {
              fishFarmId: data.fishFarm,
              productionUnitId: data.productionUnit,
              fishCount: updatedFishCount.toString(),
              // Update batchNumberId to the latest batch for backward compatibility
              batchNumberId: safeBatchNumber || currentProduction.batchNumberId,
              // Store all batch IDs in the array
              batchIds: batchIdsArray,
              biomass: updatedBiomass.toFixed(2),
              meanLength: data.meanLength || currentProduction.meanLength || '',
              meanWeight: updatedMeanWeight,
              stockingLevel: data.stockingLevel || currentProduction.stockingLevel || '',
              currentDate: data.currentDate || currentProduction.currentDate || '',
              stockingDensityKG: updatedStockingDensityKG,
              stockingDensityNM: updatedStockingDensityNM,
              field: field,
            },
          });
        } else {
          // New production record - create with the stock values for the first batch
          const capacity = await getProductionUnitCapacity(data.productionUnit);
          const stockingDensityKG = capacity > 0 
            ? (parseNumber(data.biomass) / capacity).toFixed(2) 
            : '0';
          const stockingDensityNM = capacity > 0 
            ? (parseNumber(data.count) / capacity).toFixed(2) 
            : '0';

          // Initialize batchIds array with the first batch
          const initialBatchIds = safeBatchNumber ? [safeBatchNumber] : [];

          const newProduction = await prisma.production.create({
            data: {
              fishFarmId: data.fishFarm,
              productionUnitId: data.productionUnit,
              fishCount: data.count,
              batchNumberId: safeBatchNumber, // First batch stocked
              batchIds: initialBatchIds, // Store batch IDs array
              biomass: data.biomass,
              meanLength: data.meanLength || '',
              meanWeight: data.meanWeight || calculateMeanWeight(parseNumber(data.biomass), parseNumber(data.count)),
              stockingLevel: data.stockingLevel || '',
              stockingDensityKG: stockingDensityKG,
              stockingDensityNM: stockingDensityNM,
              organisationId: body.organisationId ?? null,
              age: '',
              currentDate: data.currentDate || '',
              field: field,
            },
          });

          // Create history entry for this batch
          await prisma.fishManageHistory.create({
            data: {
              fishFarmId: data.fishFarm,
              productionUnitId: data.productionUnit,
              fishCount: data.count,
              batchNumberId: safeBatchNumber,
              fishSupplyId: safeBatchNumber,
              biomass: data.biomass,
              meanLength: data.meanLength || '',
              meanWeight: data.meanWeight || calculateMeanWeight(parseNumber(data.biomass), parseNumber(data.count)),
              stockingLevel: data.stockingLevel || '',
              stockingDensityKG: stockingDensityKG,
              stockingDensityNM: stockingDensityNM,
              organisationId: body.organisationId ?? null,
              currentDate: data.currentDate || '',
              age: '',
              field: 'Stock',
              productionId: newProduction.id,
            },
          });
        }
      } else if (field === 'Mortalities') {
        // For Mortalities: Subtract from current stock
        if (data.id) {
          const currentProduction = await prisma.production.findUnique({
            where: { id: Number(data.id) },
          });

          if (currentProduction) {
            const currentBiomass = parseNumber(currentProduction.biomass);
            const currentFishCount = parseNumber(currentProduction.fishCount);
            const mortalityBiomass = parseNumber(data.biomass);
            const mortalityFishCount = parseNumber(data.count);

            // Calculate new totals by subtracting mortalities
            const updatedBiomass = Math.max(0, currentBiomass - mortalityBiomass);
            const updatedFishCount = Math.max(0, currentFishCount - mortalityFishCount);
            const updatedMeanWeight = calculateMeanWeight(updatedBiomass, updatedFishCount);

            // Get production unit capacity for stocking density
            const capacity = await getProductionUnitCapacity(data.productionUnit);
            const updatedStockingDensityKG = capacity > 0 
              ? (updatedBiomass / capacity).toFixed(2) 
              : '0';
            const updatedStockingDensityNM = capacity > 0 
              ? (updatedFishCount / capacity).toFixed(2) 
              : '0';

            // Create history entry with mortality values
            await prisma.fishManageHistory.create({
              data: {
                fishFarmId: data.fishFarm,
                productionUnitId: data.productionUnit,
                fishCount: data.count, // Mortality count
                batchNumberId: safeBatchNumber || currentProduction.batchNumberId,
                fishSupplyId: safeBatchNumber || currentProduction.batchNumberId,
                biomass: data.biomass, // Mortality biomass
                meanLength: data.meanLength || currentProduction.meanLength || '',
                meanWeight: data.meanWeight || calculateMeanWeight(mortalityBiomass, mortalityFishCount),
                stockingLevel: data.stockingLevel || currentProduction.stockingLevel || '',
                stockingDensityKG: data.stockingDensityKG || updatedStockingDensityKG,
                stockingDensityNM: data.stockingDensityNM || updatedStockingDensityNM,
                organisationId: body.organisationId ?? null,
                currentDate: data.currentDate,
                age: '',
                field: 'Mortalities',
                productionId: Number(data.id),
              },
            });

            // Update production with reduced values
            await prisma.production.update({
              where: { id: Number(data.id) },
              data: {
                fishCount: updatedFishCount.toString(),
                biomass: updatedBiomass.toFixed(2),
                meanWeight: updatedMeanWeight,
                currentDate: data.currentDate || currentProduction.currentDate || '',
                stockingDensityKG: updatedStockingDensityKG,
                stockingDensityNM: updatedStockingDensityNM,
                field: field,
              },
            });
          }
        }
      } else if (field === 'Transfer') {
        // For Transfer: Subtract from source, add to destination
        if (data.id) {
          // Get source production (the unit being transferred from)
          const sourceProduction = await prisma.production.findUnique({
            where: { id: Number(data.id) },
          });

          if (sourceProduction) {
            const sourceBiomass = parseNumber(sourceProduction.biomass);
            const sourceFishCount = parseNumber(sourceProduction.fishCount);
            const transferBiomass = parseNumber(data.biomass);
            const transferFishCount = parseNumber(data.count);

            // Calculate new source totals by subtracting transfer
            const updatedSourceBiomass = Math.max(0, sourceBiomass - transferBiomass);
            const updatedSourceFishCount = Math.max(0, sourceFishCount - transferFishCount);
            const updatedSourceMeanWeight = calculateMeanWeight(updatedSourceBiomass, updatedSourceFishCount);

            // Get source production unit capacity
            const sourceCapacity = await getProductionUnitCapacity(sourceProduction.productionUnitId);
            const updatedSourceStockingDensityKG = sourceCapacity > 0 
              ? (updatedSourceBiomass / sourceCapacity).toFixed(2) 
              : '0';
            const updatedSourceStockingDensityNM = sourceCapacity > 0 
              ? (updatedSourceFishCount / sourceCapacity).toFixed(2) 
              : '0';

            // Update source production
            await prisma.production.update({
              where: { id: Number(data.id) },
              data: {
                fishCount: updatedSourceFishCount.toString(),
                biomass: updatedSourceBiomass.toFixed(2),
                meanWeight: updatedSourceMeanWeight,
                stockingDensityKG: updatedSourceStockingDensityKG,
                stockingDensityNM: updatedSourceStockingDensityNM,
                field: field,
              },
            });

            // Create history entry for source (transfer out)
            await prisma.fishManageHistory.create({
              data: {
                fishFarmId: sourceProduction.fishFarmId,
                productionUnitId: sourceProduction.productionUnitId,
                fishCount: data.count, // Transfer count
                batchNumberId: safeBatchNumber || sourceProduction.batchNumberId,
                fishSupplyId: safeBatchNumber || sourceProduction.batchNumberId,
                biomass: data.biomass, // Transfer biomass
                meanLength: data.meanLength || sourceProduction.meanLength || '',
                meanWeight: data.meanWeight || calculateMeanWeight(transferBiomass, transferFishCount),
                stockingLevel: data.stockingLevel || sourceProduction.stockingLevel || '',
                stockingDensityKG: data.stockingDensityKG || updatedSourceStockingDensityKG,
                stockingDensityNM: data.stockingDensityNM || updatedSourceStockingDensityNM,
                organisationId: body.organisationId ?? null,
                currentDate: data.currentDate,
                age: '',
                field: 'Transfer',
                productionId: Number(data.id),
              },
            });

            // Handle destination production unit
            if (data.productionUnit && data.productionUnit !== sourceProduction.productionUnitId) {
              // First try to find destination production with matching batch
              let destinationProduction = await prisma.production.findFirst({
                where: {
                  fishFarmId: data.fishFarm || sourceProduction.fishFarmId,
                  productionUnitId: data.productionUnit,
                  batchNumberId: safeBatchNumber || sourceProduction.batchNumberId,
                },
              });

              // If not found, find ANY existing production in that unit (to add to it)
              if (!destinationProduction) {
                destinationProduction = await prisma.production.findFirst({
                  where: {
                    fishFarmId: data.fishFarm || sourceProduction.fishFarmId,
                    productionUnitId: data.productionUnit,
                  },
                  orderBy: {
                    currentDate: 'desc', // Get the most recent production
                  },
                });
              }

              if (destinationProduction) {
                // Update existing destination production
                const destBiomass = parseNumber(destinationProduction.biomass);
                const destFishCount = parseNumber(destinationProduction.fishCount);

                const updatedDestBiomass = destBiomass + transferBiomass;
                const updatedDestFishCount = destFishCount + transferFishCount;
                const updatedDestMeanWeight = calculateMeanWeight(updatedDestBiomass, updatedDestFishCount);

                const destCapacity = await getProductionUnitCapacity(data.productionUnit);
                const updatedDestStockingDensityKG = destCapacity > 0 
                  ? (updatedDestBiomass / destCapacity).toFixed(2) 
                  : '0';
                const updatedDestStockingDensityNM = destCapacity > 0 
                  ? (updatedDestFishCount / destCapacity).toFixed(2) 
                  : '0';

                // Calculate mean length: use weighted average if both have values, otherwise use provided or existing
                let updatedMeanLength = destinationProduction.meanLength || '';
                if (data.meanLength && destinationProduction.meanLength) {
                  // Weighted average: (existing_meanLength * existing_count + new_meanLength * new_count) / total_count
                  const existingMeanLength = parseNumber(destinationProduction.meanLength);
                  const newMeanLength = parseNumber(data.meanLength);
                  if (updatedDestFishCount > 0) {
                    const weightedMeanLength = ((existingMeanLength * destFishCount) + (newMeanLength * transferFishCount)) / updatedDestFishCount;
                    updatedMeanLength = weightedMeanLength.toFixed(2);
                  }
                } else {
                  updatedMeanLength = data.meanLength || destinationProduction.meanLength || '';
                }

                // Merge batchIds from source and destination to track batch lineage
                let mergedBatchIds: number[] = [];
                
                // Get destination batchIds
                if (destinationProduction.batchIds) {
                  try {
                    mergedBatchIds = Array.isArray(destinationProduction.batchIds) 
                      ? [...(destinationProduction.batchIds as number[])]
                      : JSON.parse(destinationProduction.batchIds as string);
                  } catch (e) {
                    mergedBatchIds = [];
                  }
                }
                
                // Get source batchIds and merge them
                if (sourceProduction.batchIds) {
                  try {
                    const sourceBatchIds = Array.isArray(sourceProduction.batchIds) 
                      ? sourceProduction.batchIds as number[]
                      : JSON.parse(sourceProduction.batchIds as string);
                    
                    // Add source batch IDs that aren't already in destination
                    sourceBatchIds.forEach((batchId: number) => {
                      if (!mergedBatchIds.includes(batchId)) {
                        mergedBatchIds.push(batchId);
                      }
                    });
                  } catch (e) {
                    // If source has no batchIds array, add the batchNumberId if it exists
                    if (sourceProduction.batchNumberId && !mergedBatchIds.includes(sourceProduction.batchNumberId)) {
                      mergedBatchIds.push(sourceProduction.batchNumberId);
                    }
                  }
                } else if (sourceProduction.batchNumberId && !mergedBatchIds.includes(sourceProduction.batchNumberId)) {
                  // If source has no batchIds array, use batchNumberId
                  mergedBatchIds.push(sourceProduction.batchNumberId);
                }
                
                // Also add the safeBatchNumber if provided and not already in array
                if (safeBatchNumber && !mergedBatchIds.includes(safeBatchNumber)) {
                  mergedBatchIds.push(safeBatchNumber);
                }

                await prisma.production.update({
                  where: { id: destinationProduction.id },
                  data: {
                    fishCount: updatedDestFishCount.toString(),
                    biomass: updatedDestBiomass.toFixed(2),
                    meanWeight: updatedDestMeanWeight,
                    meanLength: updatedMeanLength,
                    stockingDensityKG: updatedDestStockingDensityKG,
                    stockingDensityNM: updatedDestStockingDensityNM,
                    stockingLevel: data.stockingLevel || destinationProduction.stockingLevel || '',
                    batchNumberId: safeBatchNumber || destinationProduction.batchNumberId, // Update to transferred batch
                    batchIds: mergedBatchIds, // Merge batch IDs from source and destination
                    currentDate: data.currentDate || destinationProduction.currentDate || '',
                    age: data.age || destinationProduction.age || '', // Update age if provided
                    field: field,
                  },
                });

                // Create history entry for destination (transfer in)
                await prisma.fishManageHistory.create({
                  data: {
                    fishFarmId: data.fishFarm || sourceProduction.fishFarmId,
                    productionUnitId: data.productionUnit,
                    fishCount: data.count, // Transfer count
                    batchNumberId: safeBatchNumber || destinationProduction.batchNumberId, // Use transferred batch
                    fishSupplyId: safeBatchNumber || destinationProduction.batchNumberId,
                    biomass: data.biomass, // Transfer biomass
                    meanLength: data.meanLength || destinationProduction.meanLength || '',
                    meanWeight: data.meanWeight || calculateMeanWeight(transferBiomass, transferFishCount),
                    stockingLevel: data.stockingLevel || destinationProduction.stockingLevel || '',
                    stockingDensityKG: data.stockingDensityKG || updatedDestStockingDensityKG,
                    stockingDensityNM: data.stockingDensityNM || updatedDestStockingDensityNM,
                    organisationId: body.organisationId ?? null,
                    currentDate: data.currentDate,
                    age: data.age || '', // Include age from transfer data
                    field: 'Transfer',
                    productionId: destinationProduction.id,
                  },
                });
              } else {
                // Create new destination production
                const destCapacity = await getProductionUnitCapacity(data.productionUnit);
                const destStockingDensityKG = destCapacity > 0 
                  ? (transferBiomass / destCapacity).toFixed(2) 
                  : '0';
                const destStockingDensityNM = destCapacity > 0 
                  ? (transferFishCount / destCapacity).toFixed(2) 
                  : '0';

                // Copy batchIds from source to destination to track batch lineage
                let transferredBatchIds: number[] = [];
                if (sourceProduction.batchIds) {
                  try {
                    transferredBatchIds = Array.isArray(sourceProduction.batchIds) 
                      ? [...(sourceProduction.batchIds as number[])]
                      : JSON.parse(sourceProduction.batchIds as string);
                  } catch (e) {
                    transferredBatchIds = [];
                  }
                }
                
                // If source has no batchIds array, use batchNumberId
                if (transferredBatchIds.length === 0 && sourceProduction.batchNumberId) {
                  transferredBatchIds = [sourceProduction.batchNumberId];
                }
                
                // Also add the safeBatchNumber if provided and not already in array
                if (safeBatchNumber && !transferredBatchIds.includes(safeBatchNumber)) {
                  transferredBatchIds.push(safeBatchNumber);
                }

                const newDestProduction = await prisma.production.create({
                  data: {
                    fishFarmId: data.fishFarm || sourceProduction.fishFarmId,
                    productionUnitId: data.productionUnit,
                    fishCount: data.count,
                    batchNumberId: safeBatchNumber || sourceProduction.batchNumberId,
                    batchIds: transferredBatchIds, // Copy batch IDs from source
                    biomass: data.biomass,
                    meanLength: data.meanLength || sourceProduction.meanLength || '',
                    meanWeight: data.meanWeight || calculateMeanWeight(transferBiomass, transferFishCount),
                    stockingLevel: data.stockingLevel || sourceProduction.stockingLevel || '',
                    stockingDensityKG: destStockingDensityKG,
                    stockingDensityNM: destStockingDensityNM,
                    organisationId: body.organisationId ?? null,
                    age: data.age || '', // Include age from transfer data
                    currentDate: data.currentDate || '',
                    field: field,
                  },
                });

                // Create history entry for destination
                await prisma.fishManageHistory.create({
                  data: {
                    fishFarmId: data.fishFarm || sourceProduction.fishFarmId,
                    productionUnitId: data.productionUnit,
                    fishCount: data.count,
                    batchNumberId: safeBatchNumber || sourceProduction.batchNumberId,
                    fishSupplyId: safeBatchNumber || sourceProduction.batchNumberId,
                    biomass: data.biomass,
                    meanLength: data.meanLength || sourceProduction.meanLength || '',
                    meanWeight: data.meanWeight || calculateMeanWeight(transferBiomass, transferFishCount),
                    stockingLevel: data.stockingLevel || sourceProduction.stockingLevel || '',
                    stockingDensityKG: destStockingDensityKG,
                    stockingDensityNM: destStockingDensityNM,
                    organisationId: body.organisationId ?? null,
                    currentDate: data.currentDate || '',
                    age: '',
                    field: 'Transfer',
                    productionId: newDestProduction.id,
                  },
                });
              }
            }
          }
        }
      } else {
        // For Sample: Only create history record, DO NOT update production table
        if (field === 'Sample') {
          // Get the existing production to reference its data
          let existingProduction = null;
          if (data.id) {
            existingProduction = await prisma.production.findUnique({
              where: { id: Number(data.id) },
            });
          } else if (data.productionUnit) {
            // Find production by production unit if no ID provided
            existingProduction = await prisma.production.findFirst({
              where: {
                productionUnitId: data.productionUnit,
                fishFarmId: data.fishFarm,
              },
              orderBy: {
                currentDate: 'desc',
              },
            });
          }

          // Calculate meanWeight from noOfFish and totalWeight for Sample
          const noOfFish = parseNumber(data.noOfFish || data.count || '0');
          const totalWeight = parseNumber(data.totalWeight || data.biomass || '0');
          const calculatedMeanWeight = noOfFish > 0 ? (totalWeight / noOfFish).toFixed(2) : '0';
          const calculatedBiomass = totalWeight > 0 ? totalWeight.toFixed(2) : '0';
          const calculatedFishCount = noOfFish > 0 ? noOfFish.toString() : '0';

          // Get production unit capacity for stocking density
          const capacity = await getProductionUnitCapacity(data.productionUnit || existingProduction?.productionUnitId || '');
          const calculatedStockingDensityKG = capacity > 0 && totalWeight > 0
            ? (totalWeight / capacity).toFixed(2)
            : '0';
          const calculatedStockingDensityNM = capacity > 0 && noOfFish > 0
            ? (noOfFish / capacity).toFixed(2)
            : '0';

          // Create history record for Sample (this is the only action for Sample)
          await prisma.fishManageHistory.create({
            data: {
              fishFarmId: data.fishFarm || existingProduction?.fishFarmId || '',
              productionUnitId: data.productionUnit || existingProduction?.productionUnitId || '',
              fishCount: calculatedFishCount,
              batchNumberId: safeBatchNumber || existingProduction?.batchNumberId || null,
              fishSupplyId: safeBatchNumber || existingProduction?.batchNumberId || null,
              biomass: calculatedBiomass,
              meanLength: data.meanLength || existingProduction?.meanLength || '',
              meanWeight: calculatedMeanWeight,
              stockingLevel: data.stockingLevel || existingProduction?.stockingLevel || '',
              stockingDensityKG: calculatedStockingDensityKG,
              stockingDensityNM: calculatedStockingDensityNM,
              organisationId: body.organisationId ?? null,
              currentDate: data.currentDate || '',
              age: '',
              field: 'Sample',
              productionId: existingProduction?.id || null,
            },
          });

          // DO NOT update production table for Sample - production table keeps original stock data
        } else {
          // For Harvest, Mortalities, and other fields: Create history and update production
          await prisma.fishManageHistory.create({
            data: {
              fishFarmId: data.fishFarm,
              productionUnitId: data.productionUnit,
              fishCount: data.count,
              batchNumberId: safeBatchNumber,
              fishSupplyId: safeBatchNumber,
              biomass: data.biomass,
              meanLength: data.meanLength,
              meanWeight: data.meanWeight,
              stockingLevel: data.stockingLevel,
              stockingDensityKG: data.stockingDensityKG,
              stockingDensityNM: data.stockingDensityNM,
              organisationId: body.organisationId ?? null,
              currentDate: data.currentDate,
              age: '',
              field: field,
              productionId: data.id ? Number(data.id) : null,
            },
          });

          if (data.id) {
            // For Harvest: Subtract from current stock
            if (field === 'Harvest') {
              const currentProduction = await prisma.production.findUnique({
                where: { id: Number(data.id) },
              });

              if (currentProduction) {
                const currentBiomass = parseNumber(currentProduction.biomass);
                const currentFishCount = parseNumber(currentProduction.fishCount);
                const harvestBiomass = parseNumber(data.biomass);
                const harvestFishCount = parseNumber(data.count);

                const updatedBiomass = Math.max(0, currentBiomass - harvestBiomass);
                const updatedFishCount = Math.max(0, currentFishCount - harvestFishCount);
                const updatedMeanWeight = calculateMeanWeight(updatedBiomass, updatedFishCount);

                const capacity = await getProductionUnitCapacity(data.productionUnit);
                const updatedStockingDensityKG = capacity > 0 
                  ? (updatedBiomass / capacity).toFixed(2) 
                  : '0';
                const updatedStockingDensityNM = capacity > 0 
                  ? (updatedFishCount / capacity).toFixed(2) 
                  : '0';

                await prisma.production.update({
                  where: { id: Number(data.id) },
                  data: {
                    fishCount: updatedFishCount.toString(),
                    biomass: updatedBiomass.toFixed(2),
                    meanWeight: updatedMeanWeight,
                    currentDate: data.currentDate || currentProduction.currentDate || '',
                    stockingDensityKG: updatedStockingDensityKG,
                    stockingDensityNM: updatedStockingDensityNM,
                    field: field,
                  },
                });
              }
            } else {
              // For Mortalities and other fields (NOT Sample), update production
              await prisma.production.update({
                where: { id: Number(data.id) },
                data: {
                  fishFarmId: data.fishFarm,
                  productionUnitId: data.productionUnit,
                  fishCount: data.count,
                  batchNumberId: safeBatchNumber,
                  biomass: data.biomass,
                  meanLength: data.meanLength,
                  meanWeight: data.meanWeight,
                  stockingLevel: data.stockingLevel,
                  currentDate: data.currentDate,
                  stockingDensityKG: data.stockingDensityKG,
                  stockingDensityNM: data.stockingDensityNM,
                  field: field,
                },
              });
            }
          } else {
            // Create new production for other fields (NOT Sample)
            const capacity = await getProductionUnitCapacity(data.productionUnit);
            const stockingDensityKG = capacity > 0 
              ? (parseNumber(data.biomass) / capacity).toFixed(2) 
              : '0';
            const stockingDensityNM = capacity > 0 
              ? (parseNumber(data.count) / capacity).toFixed(2) 
              : '0';

            await prisma.production.create({
              data: {
                fishFarmId: data.fishFarm,
                productionUnitId: data.productionUnit,
                fishCount: data.count,
                batchNumberId: safeBatchNumber,
                biomass: data.biomass,
                meanLength: data.meanLength,
                meanWeight: data.meanWeight,
                stockingLevel: data.stockingLevel,
                stockingDensityKG: stockingDensityKG,
                stockingDensityNM: stockingDensityNM,
                organisationId: body.organisationId ?? null,
                age: '',
                currentDate: data.currentDate,
                field: field,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      message: 'Production batch and fish history saved successfully',
      status: true,
    });
  } catch (error: any) {
    console.error('Error in POST /api/production/mange', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
