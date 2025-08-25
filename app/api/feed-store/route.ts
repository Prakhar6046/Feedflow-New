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
  console.log('PUT request body:', body);
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
        JSON.stringify({
          status: false,
          message: 'Unauthorized: Token missing or invalid',
        }),
        { status: 401 },
      );
    }
    const body = await request.json();
    const data = body;

    if (!Object.keys(data).length) {
      return NextResponse.json({
        status: false,
        message: 'Some feilds are missing',
      });
    }

    await prisma.feedStore.create({ data });
    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'Feed Added successfully.',
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
