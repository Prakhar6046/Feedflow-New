import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
interface ContextParams {
  params: {
    fishSupplyId: string;
  };
}
export const GET = async (request: NextRequest, context: ContextParams) => {
  const fishSupplyId = context.params.fishSupplyId;

  if (!fishSupplyId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing fish supply Id' }),
      { status: 400 },
    );
  }
  try {
    const data = await prisma.fishSupply.findUnique({
      where: { id: Number(fishSupplyId) },
    });
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};

export const PUT = async (request: NextRequest, context: ContextParams) => {
  try {
    const fishSupplyId = context.params.fishSupplyId;
    const body = await request.json();
    if (!fishSupplyId) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid or missing fish supply Id' }),
        { status: 400 },
      );
    }
    await prisma.fishSupply.update({
      where: { id: Number(fishSupplyId) },
      data: { ...body },
    });
    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'Fish Supply Updated Successfully',
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
