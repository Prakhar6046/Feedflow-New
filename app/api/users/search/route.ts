import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const query = request.nextUrl.searchParams;
    const searchQuery = query.get("name");
    const organisationId = query.get("organisationId");
    const role = query.get("role");
    let users;
    if (role === "SUPERADMIN") {
      users = await prisma.user.findMany({
        where: searchQuery
          ? {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            }
          : {},
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
        where: searchQuery
          ? {
              organisationId: Number(organisationId),
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            }
          : { organisationId: Number(organisationId) },
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
