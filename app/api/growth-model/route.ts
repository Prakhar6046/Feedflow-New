import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, organisationId, isDefault, useExistingModel } = body;

    if (!organisationId) {
      return NextResponse.json(
        { error: 'Organisation ID is required' },
        { status: 400 },
      );
    }

    // Create the model first
    const createdModel = await prisma.model.create({
      data: {
        name: model.name,
        specieId: model.specie,
        productionSystemId: model.productionSystem,
        cp: parseFloat(model.cp) || 0,
        cf: parseFloat(model.cf) || 0,
        nfe: parseFloat(model.nfe) || 0,
        adcCp: parseFloat(model.adcCp) || 0,
        adcCf: parseFloat(model.adcCf) || 0,
        adcNfe: parseFloat(model.adcNfe) || 0,
        geCp: parseFloat(model.geCp) || 0,
        geCf: parseFloat(model.geCf) || 0,
        geNfe: parseFloat(model.geNfe) || 0,
        wasteFactor: parseFloat(model.wasteFactor) || 0,
        temperatureCoefficient: model.temperatureCoefficient,
        tgcA: parseFloat(model.a) || 0,
        tgcB: parseFloat(model.b) || 0,
        tgcC: parseFloat(model.c) || 0,
        tgcD: model.d ? parseFloat(model.d) : null,
        tgcE: model.e ? parseFloat(model.e) : null,
        tFCRModel: model.tFCRModel,
        tFCRa: parseFloat(model.tFCRa) || 0,
        tFCRb: parseFloat(model.tFCRb) || 0,
        tFCRc: parseFloat(model.tFCRc) || 0,
        de: parseFloat(model.de) || 0,
        organisationId: parseInt(organisationId),
        createdBy: 1,
        updatedBy: '1',
      },
    });
    if (isDefault && model.specie) {
      // Check if a default already exists for this species in this organisation
      const existingDefault = await prisma.growthModel.findFirst({
        where: {
          organisationId: parseInt(organisationId),
          isDefault: true,
          models: { specieId: model.specie },
        },
      });

      if (existingDefault) {
        return NextResponse.json(
          {
            status: false,
            message: `This species already has a default Production System. Do you want to replace it?`,
            existingDefaultId: existingDefault.id,
          },
          { status: 400 }
        );
      }
    }


    const growthModel = await prisma.growthModel.create({
      data: {
        organisationId: parseInt(organisationId),
        modelId: createdModel.id,
        isDefault: !!isDefault,
        useExistingModel: !!useExistingModel,
      },
      include: {
        models: true,
        organisation: true,
      },
    });


    return NextResponse.json({ data: growthModel });
  } catch (error) {
    console.error('Error creating growth model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');
    const modelId = searchParams.get('id');
    const type = searchParams.get('type');
    const query = searchParams.get('query'); // Added query extraction

    // If type is 'models', return Model data
    if (type === 'models') {
      if (modelId) {
        // Get specific model
        const model = await prisma.model.findUnique({
          where: { id: parseInt(modelId) },
          include: { organisation: true },
        });

        if (!model) {
          return NextResponse.json(
            { error: 'Model not found' },
            { status: 404 },
          );
        }

        return NextResponse.json({ data: model });
      }

      if (!organisationId) {
        return NextResponse.json(
          { error: 'Organisation ID is required' },
          { status: 400 },
        );
      }

      // Get all models for organisation with search filter
      const models = await prisma.model.findMany({
        where: {
          organisationId: parseInt(organisationId),
          ...(query && {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          }),
        },
        include: { organisation: true },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ data: models });
    }

    // Default: Return GrowthModel data with populated model relation
    if (modelId) {
      // Get specific growth model
      const growthModel = await prisma.growthModel.findUnique({
        where: { id: parseInt(modelId) },
        include: {
          models: true,
          organisation: true,
        },
      });
      if (!growthModel) {
        return NextResponse.json(
          { error: 'Growth Model not found' },
          { status: 404 },
        );
      }

      return NextResponse.json({ data: growthModel });
    }

    if (!organisationId) {
      return NextResponse.json(
        { error: 'Organisation ID is required' },
        { status: 400 },
      );
    }

    // Get all growth models for organisation with populated model data and search filter
    const growthModels = await prisma.growthModel.findMany({
      where: {
        organisationId: parseInt(organisationId),
        ...(query && {
          models: {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
        }),
      },
      include: {
        models: true,
        organisation: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: growthModels });
  } catch (error) {
    console.error('Error fetching growth models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, organisationId, modelId, isDefault, useExistingModel } = body;

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 },
      );
    }
    if (!organisationId) {
      return NextResponse.json(
        { status: false, message: 'Organisation ID is required.' },
        { status: 400 }
      );
    }
    const growthModel = await prisma.growthModel.findUnique({
      where: { id: parseInt(modelId) },
      include: { models: true },
    });

    if (!growthModel) {
      return NextResponse.json(
        { error: `GrowthModel with ID ${modelId} not found.` },
        { status: 404 }
      );
    }

    if (isDefault && model.specie) {
      // Check if another default exists for this species
      const existingDefault = await prisma.growthModel.findFirst({
        where: {
          organisationId: parseInt(organisationId),
          isDefault: true,
          models: {
            specieId: model.specie,
          },
          NOT: { id: parseInt(modelId) },
        },
      });

      if (existingDefault) {
        return NextResponse.json(
          {
            status: false,
            message: `This species already has a default growth model. Do you want to replace it?`,
            existingDefaultId: existingDefault.id,
          },
          { status: 400 }
        );
      }
    }

    if (useExistingModel) {
      const updatedGrowthModel = await prisma.growthModel.update({
        where: { id: parseInt(modelId) },
        data: {
          isDefault: !!isDefault,
          useExistingModel: !!useExistingModel,
        },
        include: {
          models: true,
          organisation: true,
        },
      });

      return NextResponse.json({ data: updatedGrowthModel });
    }

    // ✅ Case 2: Update GrowthModel + underlying Model
    const updatedGrowthModel = await prisma.growthModel.update({
      where: { id: parseInt(modelId) },
      data: {
        isDefault: !!isDefault,
        useExistingModel: !!useExistingModel,
      },
    });



    const updatedModel = await prisma.model.update({
      where: { id: growthModel.modelId },
      data: {
        name: model.name,
        specieId: model.specie,
        productionSystemId: model.productionSystem,
        cp: parseFloat(model.cp) || 0,
        cf: parseFloat(model.cf) || 0,
        nfe: parseFloat(model.nfe) || 0,
        adcCp: parseFloat(model.adcCp) || 0,
        adcCf: parseFloat(model.adcCf) || 0,
        adcNfe: parseFloat(model.adcNfe) || 0,
        geCp: parseFloat(model.geCp) || 0,
        geCf: parseFloat(model.geCf) || 0,
        geNfe: parseFloat(model.geNfe) || 0,
        wasteFactor: parseFloat(model.wasteFactor) || 0,
        temperatureCoefficient: model.temperatureCoefficient,
        tgcA: parseFloat(model.a) || 0,
        tgcB: parseFloat(model.b) || 0,
        tgcC: parseFloat(model.c) || 0,
        tgcD: model.d ? parseFloat(model.d) : null,
        tgcE: model.e ? parseFloat(model.e) : null,
        tFCRModel: model.tFCRModel,
        tFCRa: parseFloat(model.tFCRa) || 0,
        tFCRb: parseFloat(model.tFCRb) || 0,
        tFCRc: parseFloat(model.tFCRc) || 0,
        de: parseFloat(model.de) || 0,
        updatedBy: '1',
        updatedAt: new Date(),
      },
      include: {
        organisation: true,
      },
    });

    return NextResponse.json({ data: updatedGrowthModel, updatedModel});
  } catch (error) {
    console.error('Error updating growth model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelId = searchParams.get('id');

    if (!modelId) {
      return NextResponse.json(
        { error: 'Model ID is required' },
        { status: 400 },
      );
    }

    // Delete related records first, then the model
    await prisma.$transaction(async (tx) => {
      // First delete all GrowthModel records that reference this model
      await tx.growthModel.deleteMany({
        where: { modelId: parseInt(modelId) },
      });

      // Then delete the model
      await tx.model.delete({
        where: { id: parseInt(modelId) },
      });
    });

    return NextResponse.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting growth model:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
