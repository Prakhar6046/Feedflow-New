import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET() {
  const species = await prisma.species.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(species);
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
