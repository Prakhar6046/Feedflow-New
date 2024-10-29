import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const role = searchParams.get("role");
  const organisationId = searchParams.get("organisationId");
  const query = searchParams.get("query");
  const filter = searchParams.get("filter");

  try {
    const farms = await prisma.farm.findMany({
      include: {
        farmAddress: true,
        productionUnits: true,
      },
      orderBy: {
        createdAt: "desc", // Sort by createdAt in descending order
      },
      where: {
        ...(filter === "true"
          ? {}
          : role !== "SUPERADMIN" && !filter && organisationId
          ? { organisationId: Number(organisationId) }
          : {}),

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
    return new NextResponse(JSON.stringify({ status: true, data: farms }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
