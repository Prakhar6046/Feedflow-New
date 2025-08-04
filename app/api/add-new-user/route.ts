import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, name, organisationId, image, permissions } = await req.json();

    if (!email || !name || !organisationId) {
      return NextResponse.json(
        { message: 'Please provide all required fields.', status: false },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: 'A user with this email already exists.',
          status: false,
        },
        { status: 400 }
      );
    }

    // Proceed with user creation
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        organisationId: Number(organisationId),
        imageUrl: image || undefined, // Optional
        permissions: permissions || {}, // Optional
      },
    });

    await prisma.contact.create({
      data: {
        email: normalizedEmail,
        name,
        organisationId: Number(organisationId),
        userId: user.id,
        permission: 'NONADMIN',
      },
    });

    return NextResponse.json({
      message: 'User created successfully.',
      data: user,
      status: true,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle known Prisma error (email uniqueness)
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          message: 'A user with this email already exists.',
          status: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error', status: false },
      { status: 500 }
    );
  }
}
