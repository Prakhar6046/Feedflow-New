import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  console.log('params:', params);

  const system = await prisma.productionSystem.findUnique({
    where: { id: params.id },
  });

  if (!system) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(system);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updated = await prisma.productionSystem.update({
      where: { id: params.id },
      data: { name: name.trim() }
    });

    return NextResponse.json(updated);

  } catch (err: any) {
    console.error('Error updating production system:', err);

    if (err && err.code === 'P2002') {
      return NextResponse.json(
        { error: 'A production system with that name already exists.' },
        { status: 409 }
      );
    }

    if (err && err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Production system not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update production system' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.productionSystem.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete production system' }, { status: 500 });
  }
}
