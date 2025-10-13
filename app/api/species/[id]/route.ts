import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const species = await prisma.species.findUnique({ where: { id: params.id } });
  if (!species) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(species);
}
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
        const user = await verifyAndRefreshToken(req);
        if (user.status === 401) {
          return new NextResponse(
            JSON.stringify({
              status: false,
              message: 'Unauthorized: Token missing or invalid',
            }),
            { status: 401 },
          );
        }
    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updated = await prisma.species.update({
      where: { id: params.id },
      data: { name: name.trim() }
    });

    return NextResponse.json(updated);
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
      { error: 'Failed to update species' },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
        const user = await verifyAndRefreshToken(req);
    if (user.status === 401) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: 'Unauthorized: Token missing or invalid',
        }),
        { status: 401 },
      );
    }
    await prisma.species.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete species' }, { status: 500 });
  }
}
