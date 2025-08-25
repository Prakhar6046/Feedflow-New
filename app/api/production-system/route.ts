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

  const systems = await prisma.productionSystem.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(systems);
  } catch (error) {
    console.error("Error fetching productionSystem:", error);
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

    // Find the last created production system by code
    const lastSystem = await prisma.productionSystem.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { code: true },
    });

    let nextNumber = 1001;
    if (lastSystem?.code) {
      const match = lastSystem.code.match(/^PS(\d+)$/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    const newCode = `PS${nextNumber}`;

    const newSystem = await prisma.productionSystem.create({
      data: { 
        name: name.trim(),
        code: newCode,
      },
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
