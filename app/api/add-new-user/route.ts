import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, organisationId, image, permissions, userType } =
      await request.json();
    const user = await verifyAndRefreshToken(request);
    if (user.status === 401) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: 'Unauthorized: Token missing or invalid',
        }),
        { status: 401 },
      );
    }
    if (!email || !name || !organisationId || !userType) {
      return NextResponse.json(
        { error: 'Please provide all required data (name, email, organisationId, userType)' },
        { status: 400 },
      );
    }
    const normalizedEmail = email.toLowerCase();

    // Get organization to verify it exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: 'Organisation not found' },
        { status: 404 },
      );
    }

    const checkEmailExist = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    
    if (checkEmailExist) {
      return new NextResponse(
        JSON.stringify({
          message: 'User with this email already exists',
          status: false,
        }),
        { status: 400 },
      );
    }

    // Create user with userType as role
    const results = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name,
        organisationId: Number(organisationId),
        role: userType,
        imageUrl: image ?? undefined,
        permissions: permissions ?? {},
      },
    });

    // Create contact with userType as permission
    // await prisma.contact.create({
    //   data: {
    //     email: normalizedEmail,
    //     name: name,
    //     organisationId: Number(organisationId),
    //     userId: results.id,
    //     permission: userType,
    //     role: userType, // Store userType in role field as well
    //     permissions: permissions ?? {},
    //   },
    // });

    // If userType is advisor, create OrganisationAdvisor entry
    if (userType === 'Advisor: Technical services - adviser to Clients') {
      await prisma.organisationAdvisor.create({
        data: {
          organisationId: Number(organisationId),
          advisorId: results.id,
          accessLevel: 3, // Default access level
        },
      });
    }

    return NextResponse.json({
      message: 'User created successfully',
      data: results,
      status: true,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
