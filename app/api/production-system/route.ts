import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET() {
  const systems = await prisma.productionSystem.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(systems);
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newSystem = await prisma.productionSystem.create({
      data: { name: name.trim() },
    });

    return NextResponse.json(newSystem);

  } catch (err: any) {
    console.error('Error creating production system:', err);

    if (err && err.code === 'P2002') {
      return NextResponse.json(
        { error: `Production system with this ${err.meta?.target} already exists.` },
        { status: 409 } 
      );
    }

    return NextResponse.json(
      { error: 'Failed to create production system' },
      { status: 500 }
    );
  }
}