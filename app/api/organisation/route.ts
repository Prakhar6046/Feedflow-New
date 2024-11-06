import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const query = searchParams.get("query");

    const organisationId = searchParams.get("organisationId");
    let organisations;
    if (role === "SUPERADMIN") {
      organisations = await prisma.organisation.findMany({
        include: { contact: true, users: true },
        orderBy: {
          createdAt: "desc", // Sort by createdAt in descending order
        },
        where: {
          AND: [
            query
              ? {
                  OR: [
                    {
                      name: { contains: query, mode: "insensitive" },
                    },
                  ],
                }
              : {},
          ],
        },
      });
    } else {
      organisations = await prisma.organisation.findMany({
        where: {
          id: Number(organisationId),
          AND: [
            query
              ? {
                  OR: [
                    {
                      name: { contains: query, mode: "insensitive" },
                    },
                  ],
                }
              : {},
          ],
        },
        include: { contact: true },
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
