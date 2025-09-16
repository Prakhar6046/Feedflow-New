import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const modelId = params.id;

    if (!modelId) {
      return NextResponse.json({ error: 'Growth Model ID is required' }, { status: 400 });
    }

    const growthModel = await prisma.growthModel.findUnique({
      where: { id: parseInt(modelId) },
      include: {
        models: true,
        organisation: true,
        selectedFarms: { include: { farm: true } },
      },
    });

    if (!growthModel) {
      return NextResponse.json({ error: 'Growth Model not found' }, { status: 404 });
    }

    return NextResponse.json({ data: growthModel });
  } catch (error) {
    console.error('Error fetching single growth model:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
