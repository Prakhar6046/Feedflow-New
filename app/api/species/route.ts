import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

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
    const species = await prisma.species.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        defaultProductionSystem: true,
      },
    });

    return NextResponse.json(species);
  } catch (error) {
    console.error("Error fetching species:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newSpecies = await prisma.species.create({
      data: { name: name.trim() }
    });

    return NextResponse.json(newSpecies);
  } catch (err) {
    if (
      err &&
      err.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Species name already exists. Please use a different name.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create species' },
      { status: 500 }
    );
  }
}
