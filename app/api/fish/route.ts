import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

export const GET = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: 'Unauthorized: Token missing or invalid' },
      { status: 401 },
    );
  }
  try {
    const searchParams = request.nextUrl.searchParams;
    const organisationId = searchParams.get('organisationId');
    const role = searchParams.get('role');
    const query = searchParams.get('query');

    const fishSupply = await prisma.fishSupply.findMany({
      include: {
        creator: { include: { hatchery: true, Farm: true } },
        farm: true,
      },
      where: {
        ...(role !== 'SUPERADMIN' && organisationId
          ? { organisationId: Number(organisationId) }
          : {}),
        AND: [
          query
            ? {
                OR: [
                  {
                    status: { contains: query, mode: 'insensitive' },
                  },

                  {
                    broodstockMale: { contains: query, mode: 'insensitive' },
                  },
                  {
                    broodstockFemale: { contains: query, mode: 'insensitive' },
                  },
                ],
              }
            : {},
        ],
      },
      orderBy: {
        status: 'asc', // Sort by createdAt in descending order
      },
    });
    return new NextResponse(
      JSON.stringify({
        status: true,
        data: fishSupply,
      }),
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
export const POST = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: 'Unauthorized: Token missing or invalid' },
      { status: 401 },
    );
  }
  try {
    const body = await request.json();
    // batchNumber: `${data.hatchingDate}-${
    //   data.creator?.hatchery[0]?.code
    // }-${
    //   data.spawningNumber
    // }-${fish?.creator?.hatchery[0]?.fishSpecie.slice(
    //   0,
    //   1
    // )}`,
    if (!body.organisation || !body.fishFarmId) {
      return new NextResponse(
        JSON.stringify({
          message: 'Fish farm or organisation missing',
          status: false,
        }),
        {
          status: 404,
        },
      );
    }

    const isHatcheryExist = await prisma.organisation.findUnique({
      where: { id: body.organisation },
      include: { hatchery: true },
    });
    if (!isHatcheryExist) {
      return new NextResponse(
        JSON.stringify({
          message: 'Hatchery not found',
          status: false,
        }),
        {
          status: 404,
        },
      );
    }
    const isFarmExist = await prisma.farm.findUnique({
      where: { id: body.fishFarmId },
      include: { productionUnits: true },
    });

    if (!isFarmExist) {
      return new NextResponse(
        JSON.stringify({
          message: 'farm not found',
          status: false,
        }),
        {
          status: 404,
        },
      );
    }

    // Check if hatchery exists and has the required data
    if (!isHatcheryExist.hatchery || isHatcheryExist.hatchery.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: 'No hatchery found for this organisation',
          status: false,
        }),
        {
          status: 404,
        },
      );
    }

    const hatchery = isHatcheryExist.hatchery[0];
    const fishSupplyData = {
      ...body,
      createdBy: isHatcheryExist.id,
      organisationId: Number(body.organisationId),
      batchNumber: `${body.hatchingDate}-${hatchery.code}-${
        body.spawningNumber
      }-${hatchery.fishSpecie.slice(0, 1)}`,
      species: body.species || null,
    };
    const newFishSupply = await prisma.fishSupply.create({
      data: fishSupplyData,
    });
    return new NextResponse(
      JSON.stringify({
        data: newFishSupply,
        message: 'Fish Supply Created Successfully',
        status: true,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
