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
        orderBy: {
          createdAt: "desc", // Sort by createdAt in descending order
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
          createdAt: "desc", // Sort by createdAt in descending order
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
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const userId = await request.json();
    console.log(userId);

    const deletedUser = await prisma.user.delete({
      where: { role: { not: "SUPERADMIN" }, id: Number(userId) },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: deletedUser,
        message: "User Deleted Successfully",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
