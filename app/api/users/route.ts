import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get('role');
    const query = searchParams.get('query');

    const organisationId = searchParams.get('organisationId');
    let users;

    if (role === 'SUPERADMIN') {
      users = await prisma.user.findMany({
        where: {
          id: { not: 1 },
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
          ],
        },
        include: {
          organisation: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Sort by createdAt in descending order
        },
      });
    } else {
      users = await prisma.user.findMany({
        where: { organisationId: Number(organisationId), id: { not: 1 } },
        include: {
          organisation: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Sort by createdAt in descending order
        },
      });
    }

    return new NextResponse(JSON.stringify({ status: true, data: users }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    // const searchParams = request.nextUrl.searchParams;
    // const role = searchParams.get('role');
    const userId = await request.json();

    const deletedUser = await prisma.user.delete({
      where: { role: { not: 'SUPERADMIN' }, id: Number(userId) },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: deletedUser,
        message: 'User Deleted Successfully',
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

export const PATCH = async (request: NextRequest) => {
  try {
    const { id, users } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid or missing Organisation id.' },
        { status: 404 },
      );
    }

    const organisation = await prisma.organisation.findUnique({
      where: { id: Number(id) },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: 'Organisation not found.' },
        { status: 404 },
      );
    }

    const updatedUsers = [];

    for (const userId of users) {
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });

      if (!user || user.role === 'SUPERADMIN') continue;

      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
          access: !user.access,
        },
      });

      updatedUsers.push({
        id: updatedUser.id,
        name: updatedUser.name,
        newAccess: updatedUser.access,
      });
    }

    return NextResponse.json({
      status: true,
      message: `Access updated`,
      users: updatedUsers,
    });
  } catch (error) {
    console.error(error);

    return new NextResponse(
      JSON.stringify({ status: false, error: 'Internal Server Error' }),
      { status: 500 },
    );
  }
};
