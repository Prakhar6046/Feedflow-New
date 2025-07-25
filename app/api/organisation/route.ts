import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { Organisation } from '@prisma/client';
import { Prisma } from '@prisma/client';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const query = searchParams.get('query');
    const tab = searchParams.get('tab');
    const organisationId = searchParams.get('organisationId');

    const tabFilter =
      tab === 'fishProducers'
        ? 'Fish Producer'
        : tab === 'feedSuppliers'
          ? 'Feed Supplier'
          : undefined;

    const baseWhereClause: Prisma.OrganisationWhereInput = {
      AND: [
        query
          ? {
              OR: [
                {
                  name: { contains: query, mode: 'insensitive' },
                },
              ],
            }
          : {},
        tabFilter
          ? {
              organisationType: tabFilter,
            }
          : {},
      ],
    };

    let organisations: Organisation[] | null;

    if (role === 'SUPERADMIN') {
      organisations = await prisma.organisation.findMany({
        include: { contact: true, users: true, hatchery: true },
        orderBy: { createdAt: 'desc' },
        where: baseWhereClause,
      });
    } else {
      organisations = await prisma.organisation.findMany({
        where: {
          OR: [
            { id: Number(organisationId) },
            { createdBy: Number(organisationId) },
          ],
          AND: baseWhereClause.AND, // Must ensure logical nesting
        },
        include: { contact: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(
      { status: true, data: organisations },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Error in /api/organisation:', error);
    return NextResponse.json(
      { status: false, error: 'Internal Server Error' },
      { status: 500 },
    );
  }
};
