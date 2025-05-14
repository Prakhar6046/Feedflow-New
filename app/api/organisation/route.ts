import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const query = searchParams.get("query");
    const tab = searchParams.get("tab");

    const organisationId = searchParams.get("organisationId");
    // Map tab value to organisationType
    const tabFilter =
      tab === "fishFarmers"
        ? "Fish Farmer"
        : tab === "feedSuppliers"
        ? "Feed Supplier"
        : null;

    // Common filters for all roles
    const baseWhereClause: any = {
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
        tabFilter
          ? {
              organisationType: tabFilter,
            }
          : {},
      ],
    };
    let organisations;
    if (role === "SUPERADMIN") {
      organisations = await prisma.organisation.findMany({
        include: { contact: true, users: true, hatchery: true },
        orderBy: {
          createdAt: "desc", // Sort by createdAt in descending order
        },
        where: baseWhereClause,
      });
    } else {
      organisations = await prisma.organisation.findMany({
        where: {
          id: Number(organisationId),
          ...baseWhereClause,
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
