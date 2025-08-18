import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const speciesId = params.id; 
    const body = await request.json();
    const { defaultProductionSystemId } = body; 
       console.log('Received body:', body);
       console.log('Species ID from params:', speciesId);
       console.log('Default Production System ID:', defaultProductionSystemId);
    // 1. Validate inputs
    if (!speciesId) {
      return NextResponse.json(
        { status: false, message: 'Species ID is required in the URL.' },
        { status: 400 }
      );
    }

    if (defaultProductionSystemId === undefined) {
      return NextResponse.json(
        { status: false, message: 'Default Production System ID (or null to clear) is required in the request body.' },
        { status: 400 }
      );
    }

    if (defaultProductionSystemId !== null) {
      const productionSystemExists = await prisma.productionSystem.findUnique({
        where: { id: defaultProductionSystemId },
      });

      if (!productionSystemExists) {
        return NextResponse.json(
          { status: false, message: `Production System with ID "${defaultProductionSystemId}" not found.` },
          { status: 404 }
        );
      }
    }


    const updatedSpecies = await prisma.species.update({
      where: { id: speciesId },
      data: {
        defaultProductionSystemId: defaultProductionSystemId, 
      },
      select: { 
        id: true,
        name: true,
        isFeatured: true,
        defaultProductionSystemId: true,
        defaultProductionSystem: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: true,
        message: 'Default production system for species updated successfully.',
        data: updatedSpecies,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting default production system for species:', error);
    if (error instanceof Error && (error as any).code === 'P2025') {
        return NextResponse.json(
            { status: false, message: 'Species not found.' },
            { status: 404 }
        );
    }
    return NextResponse.json(
      { status: false, message: 'Internal server error.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
