import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

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
    if (!body.speciesId) {
      return NextResponse.json({ message: 'Species ID is required', status: false }, { status: 400 });
    }

    const species = await prisma.species.findUnique({ where: { id: body.speciesId } });
    if (!species) {
      return NextResponse.json({ message: 'Species not found', status: false }, { status: 404 });
    }

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

    // organisation is now a string (hatchery name), not an ID
    const hatcheryName = String(body.organisation || '').trim();
    
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

    // Use custom batchNumber if provided, otherwise auto-generate
    let batchNumber = body.batchNumber;
    if (!batchNumber || batchNumber.trim() === '') {
      // Generate batch number using hatchery name and other data
      const hatcheryCode = hatcheryName.slice(0, 3).toUpperCase() || 'HATCH';
      const speciesCode = species.name.charAt(0).toUpperCase();
      batchNumber = `${body.hatchingDate}-${hatcheryCode}-${body.spawningNumber}-${speciesCode}`;
    }
    
    // Prepare data for FishSupply creation
    const fishSupplyData = {
      batchNumber: batchNumber,
      organisation: hatcheryName, // Store hatchery name as string
      hatchingDate: body.hatchingDate,
      spawningDate: body.spawningDate,
      spawningNumber: Number(body.spawningNumber) || 1,
      age: body.age || '0', // Use provided age or default to '0'
      broodstockMale: body.broodstockMale || null,
      broodstockFemale: body.broodstockFemale || null,
      fishFarmId: body.fishFarmId,
      status: body.status || 'Stocked',
      productionUnits: body.productionUnits || '',
      speciesId: body.speciesId || null,
      createdBy: Number(body.organisationId), // Use organisationId for createdBy
      organisationId: Number(body.organisationId),
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
    console.error('Error creating fish supply:', error);
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
