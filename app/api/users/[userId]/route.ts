import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

interface ContextParams {
  params: {
    userId: string;
  };
}

export const GET = async (_request: NextRequest, context: ContextParams) => {
  const userId = context.params.userId;

  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing userId' }),
      { status: 400 },
    );
  }
  try {
    const data = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        organisation: {
          select: {
            name: true,
            organisationType: true,
            Farm: true,
          },
        },
      },
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

export async function PUT(req: NextRequest, context: ContextParams) {
  try {
    const userId = context.params.userId;

    // Check if a user exists
    const userData = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { Contact: true },
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Accept JSON body
    const body = await req.json();

    const permissions = body.permissions;
    const newPassword = body.password;
    let encryptedPassword;
    let updateData;

    if (newPassword) {
      encryptedPassword = bcrypt.hashSync(newPassword, 8);
      updateData = {
        name: body.name,
        email: body.email,
        organisationId: Number(body.organisationId),
        permissions: permissions ?? {},
        password: encryptedPassword,
      };
    } else {
      updateData = {
        name: body.name,
        email: body.email,
        imageUrl: body.imageUrl,
        organisationId: Number(body.organisationId),
        permissions: permissions ?? {},
      };
    }
    await prisma.contact.update({
      where: { userId: Number(userId), id: userData?.Contact[0].id },
      data: {
        name: body.name,
        email: body.email,
      },
    });
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        ...updateData,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: 'Profile successfully updated!' }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
