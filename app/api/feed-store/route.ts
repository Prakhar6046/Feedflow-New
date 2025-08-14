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

        // Extract speciesId from item to handle relation separately
        const { speciesId, ...rest } = item;

        // Prepare update data object
        const updateData: any = { ...rest };

        // Handle relation update
        if (speciesId) {
          updateData.species = { connect: { id: speciesId } };
        } else {
          // Optionally disconnect species relation if speciesId is null/undefined
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
        message: 'Feed store updated successfully.',
      }),
    );
  } catch (error) {
    console.error('Error updating feed store:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
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
