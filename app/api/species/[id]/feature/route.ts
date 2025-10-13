import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
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
    const { id } = params;

    const species = await prisma.species.findUnique({ where: { id } });
    if (!species) {
      return NextResponse.json({ error: 'Species not found' }, { status: 404 });
    }

    const updated = await prisma.species.update({
      where: { id },
      data: { isFeatured: !species.isFeatured },
    });

    return NextResponse.json({
      message: updated.isFeatured ? 'Species featured' : 'Species unfeatured',
      species: updated,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
