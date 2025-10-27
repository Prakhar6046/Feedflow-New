import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
import { FeedProduct } from '@/app/_typeModels/Feed';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
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
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const organisationId = searchParams.get('organisationId');
    const query = searchParams.get('query');

    const feedStoresRaw = await prisma.feedStore.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        species: {
          select: {
            name: true,
          },
        },
      },
    });

    const feedStores = feedStoresRaw.map(({ species, ...rest }) => ({
      ...rest,
      species: species?.name || null,
    }));
    return new NextResponse(
      JSON.stringify({
        status: true,
        data: feedStores,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}


// Helper: convert value to number (if possible)
function toNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// List of numeric fields in FeedStore schema
const numericFields: (keyof any)[] = [
  'shelfLifeMonths',
  'feedCost',
  'moistureGPerKg',
  'crudeProteinGPerKg',
  'crudeFatGPerKg',
  'crudeFiberGPerKg',
  'crudeAshGPerKg',
  'nfe',
  'calciumGPerKg',
  'phosphorusGPerKg',
  'carbohydratesGPerKg',
  'metabolizableEnergy',
  'geCoeffCP',
  'geCoeffCF',
  'geCoeffNFE',
  'ge',
  'digCP',
  'digCF',
  'digNFE',
  'deCP',
  'deCF',
  'deNFE',
  'de',
];

export async function PUT(request: NextRequest) {
  try {
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

    const body = await request.json();

    // Validate speciesId values
    const validSpeciesIds = await prisma.species.findMany({
      select: { id: true },
    });
    const validSpeciesIdSet = new Set(validSpeciesIds.map((s) => s.id));

    await Promise.all(
      body?.map(async (item: any) => {
        if (!item.id) {
          throw new Error(`Missing id for feedStore item: ${JSON.stringify(item)}`);
        }

        if (item.speciesId && !validSpeciesIdSet.has(item.speciesId)) {
          throw new Error(`Invalid speciesId: ${item.speciesId}`);
        }

        // Extract speciesId for relation
        const { speciesId, ...rest } = item;

        // Convert numeric string fields -> numbers
        for (const field of numericFields) {
          if (rest[field] !== undefined) {
            rest[field] = toNumber(rest[field]);
          }
        }

        // Build updateData
        const updateData: any = { ...rest };

        // Handle relation
        if (speciesId) {
          updateData.species = { connect: { id: speciesId } };
        } else {
          updateData.species = { disconnect: true };
        }

        await prisma.feedStore.update({
          where: { id: item.id },
          data: updateData,
        });
      }),
    );

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'FeedStore updated successfully',
      }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error updating FeedStore:', error);
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: error.message || 'Something went wrong',
      }),
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAndRefreshToken(request);
    if (user.status === 401) {
      return new NextResponse(
        JSON.stringify({ status: false, message: 'Unauthorized: Token missing or invalid' }),
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!Object.keys(body).length) {
      return NextResponse.json({ status: false, message: 'Some fields are missing' });
    }

    // Transform data to match Prisma schema
    const data: any = {
      brandName: body.brandName || 'SAF 6000',
      productName: body.productName || 'Tilapia starter #0',
      productFormat: body.productFormat || 'Mash',
      particleSize: body.particleSize || '#0',
      minFishSizeG: body.minFishSizeG || 0.5,
      maxFishSizeG: body.maxFishSizeG || 1.0,
      nutritionalClass: body.nutritionalClass || 'Complete and balanced',
      nutritionalPurpose: body.nutritionalPurpose || 'Primary feed source',
      suitableSpecies: body.suitableSpecies || 'Tilapia',
      suitabilityAnimalSize: body.suitabilityAnimalSize || '',
      productionIntensity: body.productionIntensity || 'Intensive',
      suitabilityUnit: body.suitabilityUnit || 'Hatchery',
      feedingPhase: body.feedingPhase || 'Pre-starter',
      lifeStage: body.lifeStage || 'Fry',
      shelfLifeMonths: body.shelfLifeMonths || 12,
      feedCost: body.feedCost || 32,
      feedIngredients: body.feedIngredients || '',
      moistureGPerKg: body.moistureGPerKg || 120,
      crudeProteinGPerKg: body.crudeProteinGPerKg || 400,
      crudeFatGPerKg: body.crudeFatGPerKg || 50,
      crudeFiberGPerKg: body.crudeFiberGPerKg || 40,
      crudeAshGPerKg: body.crudeAshGPerKg || 80,
      nfe: body.nfe || 310,
      calciumGPerKg: body.calciumGPerKg || 30,
      phosphorusGPerKg: body.phosphorusGPerKg || 7,
      carbohydratesGPerKg: body.carbohydratesGPerKg || 310,
      metabolizableEnergy: body.metabolizableEnergy || 12,
      geCoeffCP: body.geCoeffCP || 23,
      geCoeffCF: body.geCoeffCF || 39,
      geCoeffNFE: body.geCoeffNFE || 17,
      ge: body.ge || 16.75,
      digCP: body.digCP || 3600,
      digCF: body.digCF || 450,
      digNFE: body.digNFE || 1860,
      deCP: body.deCP || 8.5,
      deCF: body.deCF || 1.78,
      deNFE: body.deNFE || 3.2,
      de: body.de || 13.47,
      feedingGuide: body.feedingGuide || "Feed according to the feedflow guide or as directed by a fish nutritionist",
      ProductSupplier: body.ProductSupplier || [],
      isDefault: body.isDefault || false,

      // Correct way to connect organisation
      organisation: {
        connect: { id: body.organisationId || 1 },
      },

      // Correct way to connect species if provided
      species: body.speciesId
        ? { connect: { id: body.speciesId } }
        : undefined,
    };

    const feed = await prisma.feedStore.create({ data });

    return NextResponse.json({
      status: true,
      message: 'Feed added successfully',
      feed,
    });
  } catch (error) {
    console.error('Error creating FeedStore:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAndRefreshToken(request);
    if (user.status === 401) {
      return new NextResponse(
        JSON.stringify({ status: false, message: 'Unauthorized' }),
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id, ids } = body;

    // Normalize into an array of IDs
    const deleteIds: string[] = [];
    if (id) deleteIds.push(id);
    if (Array.isArray(ids)) deleteIds.push(...ids);

    if (deleteIds.length === 0) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: 'FeedStore ID(s) are required',
        }),
        { status: 400 },
      );
    }

    await prisma.feedStore.deleteMany({
      where: { id: { in: deleteIds } },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: `Deleted ${deleteIds.length} FeedStore(s) successfully`,
      }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error deleting FeedStore:', error);
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: error.message || 'Something went wrong',
      }),
      { status: 500 },
    );
  }
}
