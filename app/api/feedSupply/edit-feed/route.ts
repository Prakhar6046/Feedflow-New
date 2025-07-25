import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) {
      throw new Error('Feed ID is required for updating.');
    }
    const updatedFeed = await prisma.feedSupply.update({
      where: { id: body.id },
      data: rest,
    });
    // const updateFeed
    return NextResponse.json({
      message: 'Feed updated successfully',
      data: updatedFeed,
      status: true,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
