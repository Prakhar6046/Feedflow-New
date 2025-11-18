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
      brandName: body.brandName,
      productName: body.productName,
      productFormat: body.productFormat ,
      particleSize: body.particleSize ,
      minFishSizeG: body.minFishSizeG ,
      maxFishSizeG: body.maxFishSizeG ,
      nutritionalClass: body.nutritionalClass ,
      nutritionalPurpose: body.nutritionalPurpose ,
      suitableSpecies: body.suitableSpecies,
      suitabilityAnimalSize: body.suitabilityAnimalSize ,
      productionIntensity: body.productionIntensity ,
      suitabilityUnit: body.suitabilityUnit,
      feedingPhase: body.feedingPhase,
      lifeStage: body.lifeStage,
      shelfLifeMonths: body.shelfLifeMonths ,
      feedCost: body.feedCost,
      feedIngredients: body.feedIngredients ,
      moistureGPerKg: body.moistureGPerKg ,
      crudeProteinGPerKg: body.crudeProteinGPerKg ,
      crudeFatGPerKg: body.crudeFatGPerKg,
      crudeFiberGPerKg: body.crudeFiberGPerKg ,
      crudeAshGPerKg: body.crudeAshGPerKg ,
      nfe: body.nfe,
      calciumGPerKg: body.calciumGPerKg,
      phosphorusGPerKg: body.phosphorusGPerKg,
      carbohydratesGPerKg: body.carbohydratesGPerKg,
      metabolizableEnergy: body.metabolizableEnergy,
      geCoeffCP: body.geCoeffCP,
      geCoeffCF: body.geCoeffCF,
      geCoeffNFE: body.geCoeffNFE,
      ge: body.ge,
      digCP: body.digCP,
      digCF: body.digCF,
      digNFE: body.digNFE,
      deCP: body.deCP,
      deCF: body.deCF,
      deNFE: body.deNFE,
      de: body.de,
      feedingGuide: body.feedingGuide,
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
