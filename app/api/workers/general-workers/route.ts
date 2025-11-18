import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

export const dynamic = 'force-dynamic';

/**
 * GET /api/workers/general-workers
 * Fetches all General worker (level 1) and General worker (level 2) users
 * from Fish Producer organizations
 */
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
    const query = searchParams.get('query');

    // Find all General workers (level 1 and 2) from Fish Producer organizations
    const workers = await prisma.user.findMany({
      where: {
        organisation: {
          organisationType: 'Fish Producer',
          ...(organisationId
            ? {
                OR: [
                  { id: Number(organisationId) },
                  { createdBy: Number(organisationId) },
                ],
              }
            : {}),
        },
        role: {
          in: ['General worker (level 1)', 'General worker (level 2)'],
        },
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organisationId: true,
        organisation: {
          select: {
            id: true,
            name: true,
            organisationType: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(
      {
        status: true,
        data: workers,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Error in /api/workers/general-workers:', error);
    return NextResponse.json(
      { status: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};

