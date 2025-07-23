import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

export const GET = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: 'Unauthorized: Token missing or invalid' },
      { status: 401 },
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const organisationId = searchParams.get('organisationId');
    const hasFeedSupplierOrg = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
      include: { users: true },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: hasFeedSupplierOrg }),
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
