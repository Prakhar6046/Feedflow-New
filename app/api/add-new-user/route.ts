import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name, organisationId, image, permissions } =
      await req.json();

    if (!email || !name || !organisationId) {
      return NextResponse.json(
        { error: 'Please provide all data' },
        { status: 400 },
      );
    }
    const normalizedEmail = email.toLowerCase();
    // const formattedName = capitalizeFirstLetter(name);

    await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    const checkEmailExist = await prisma.user.findUnique({
      where: { email },
    });
    if (checkEmailExist) {
      return new NextResponse(
        JSON.stringify({
          message: 'User is already part of this organisation',
          status: false,
        }),
        { status: 400 },
      );
    } else {
      const results = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name,
          organisationId: Number(organisationId),
          imageUrl: image ?? undefined,
          permissions: permissions ?? {},
        },
      });

      await prisma.contact.create({
        data: {
          email: normalizedEmail,
          name: name,
          organisationId: Number(organisationId),
          userId: results.id,
          permission: 'NONADMIN',
        },
      });
      return NextResponse.json({
        message: 'User created successfully',
        data: results,
        status: true,
      });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
