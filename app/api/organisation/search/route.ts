import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const query = request.nextUrl.searchParams;
    const searchQuery = query.get("name");
    const role = query.get("role");
    const organisationId = query.get("organisationId");
    let organisations;
    if (role === "SUPERADMIN") {
      organisations = await prisma.organisation.findMany({
        where: searchQuery
          ? {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            }
          : {},
        include: { contact: true, address: true },
        orderBy: {
          createdAt: "desc", // Sort by createdAt in descending order
        },
      });
    } else {
      organisations = await prisma.organisation.findMany({
        where: searchQuery
          ? {
              id: Number(organisationId),
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            }
          : { id: Number(organisationId) },
        include: { contact: true, address: true },
        orderBy: {
          createdAt: "desc", // Sort by createdAt in descending order
        },
      });
    }

    return new NextResponse(
      JSON.stringify({ status: true, data: organisations }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
