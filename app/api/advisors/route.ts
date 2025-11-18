import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';

const DEFAULT_ORGANISATION_TYPE = 'Third party advisors (external)';
const DEFAULT_USER_TYPE = 'Advisor: Technical services - adviser to Clients';

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
    const organisationType =
      searchParams.get('organisationType') ?? DEFAULT_ORGANISATION_TYPE;
    const advisorUserType = searchParams.get('userType') ?? DEFAULT_USER_TYPE;
    const query = searchParams.get('query');

    const advisorSelection = Prisma.validator<Prisma.UserSelect>()({
      id: true,
      name: true,
      email: true,
      organisationId: true,
      organisation: {
        select: {
          id: true,
          name: true,
          organisationType: true,
        },
      },
    });

    const advisors = await prisma.user.findMany({
      where: {
        organisation: {
          organisationType,
        },
        Contact: {
          some: {
            permission: advisorUserType as any,
          },
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
      select: advisorSelection,
      orderBy: [
        {
          name: 'asc',
        },
      ],
    });

    return NextResponse.json({
      status: true,
      data: advisors.map((advisor) => ({
        id: advisor.id,
        name: advisor.name ?? '',
        email: advisor.email,
        organisationId: advisor.organisationId,
        organisationName: advisor.organisation?.name ?? '',
        organisationType: advisor.organisation?.organisationType ?? '',
      })),
    });
  } catch (error) {
    console.error('Failed to load advisors', error);
    return NextResponse.json(
      { status: false, error: 'Failed to load advisors' },
      { status: 500 },
    );
  }
};

