import prisma from "@/prisma/prisma";
import { NextResponse, NextRequest } from "next/server";
export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const organisationId = searchParams.get("organisationId");
    let users;
    if (role === "SUPERADMIN") {
      users = await prisma.user.findMany({
        where: {
          id: { not: 1 }, // Exclude the user by ID
        },
        include: {
          organisation: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
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
