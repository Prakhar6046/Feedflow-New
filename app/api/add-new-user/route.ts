import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, organisationId, image } = await req.json();

    if (!email || !name || !organisationId) {
      return NextResponse.json(
        { error: "Please provide all data" },
        { status: 400 }
      );
    }
    const checkEmailExistInOrganisation = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    const checkEmailExist = await prisma.user.findUnique({
      where: { email },
    });
    if (checkEmailExist) {
      return new NextResponse(
        JSON.stringify({
          message: "User is already part of this organisation",
          status: false,
        }),
        { status: 400 }
      );
    } else {
      const results = await prisma.user.create({
        data: {
          email,
          name,
          organisationId: Number(organisationId),
          imageUrl: image ?? undefined,
        },
      });
      return NextResponse.json({
        message: "User created successfully",
        data: results,
        status: true,
      });
    }
    // return NextResponse.json({
    //       message: "User created successfully",
    //       data: results,
    //       status: true,
    //     });
    // if (checkEmailExist) {
    //   const organisation = await prisma.organisation.findUnique({
    //     where: { id: Number(organisationId) },
    //     include: { users: true },
    //   });

    //   if (!organisation) {
    //     return NextResponse.json(
    //       { error: "Organisation not found" },
    //       { status: 400 }
    //     );
    //   }

    //   // Check if the user is already part of the organisation
    //   const userExistsInOrg = organisation.users.some(
    //     (user) => user.id === checkEmailExist.id
    //   );

    //   if (userExistsInOrg) {
    //     return NextResponse.json(
    //       { error: "User is already part of this organisation" },
    //       { status: 400 }
    //     );
    //   }

    //   // Add the user to the organisation
    //   await prisma.organisation.update({
    //     where: { id: Number(organisationId) },
    //     data: {
    //       users: {
    //         connect: { id: checkEmailExist.id },
    //       },
    //     },
    //   });

    //   return NextResponse.json({
    //     message: "User added to the organisation",
    //     status: true,
    //   });
    // } else {
    //   const organisation = await prisma.organisation.findUnique({
    //     where: { id: Number(organisationId) },
    //   });

    //   if (!organisation) {
    //     return NextResponse.json(
    //       { error: "Organisation not found" },
    //       { status: 400 }
    //     );
    //   }
    //   const results = await prisma.user.create({
    //     data: {
    //       email,
    //       name,
    //       organisationId: Number(organisationId),
    //     },
    //   });

    //   return NextResponse.json({
    //     message: "User created successfully",
    //     data: results,
    //     status: true,
    //   });
    // }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
