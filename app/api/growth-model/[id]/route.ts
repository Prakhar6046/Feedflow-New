import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const modelId = searchParams.get('id')

    if (!modelId) {
      return NextResponse.json(
        { error: 'Growth Model ID is required' },
        { status: 400 },
      )
    }

    const growthModel = await prisma.growthModel.findFirst({
      where: { id: Number(modelId) },
      include: {
        models: {
          include: {
            specie: true,
            productionSystem: true,
            organisation: true,
          },
        },
        organisation: true,
        selectedFarms: {
          include: { farm: true },
        },
      },
    })



    console.log(JSON.stringify(growthModel, null, 2))

    if (!growthModel) {
      return NextResponse.json(
        { error: 'Growth Model not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      data: {
        ...growthModel,
        selectedFarms: growthModel.selectedFarms ?? [],
      },
    })

  } catch (error) {
    console.error('Error fetching single growth model:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
