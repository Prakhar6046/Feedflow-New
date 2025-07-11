import { verifyAndRefreshToken } from "@/app/_lib/auth/verifyAndRefreshToken";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const user = await verifyAndRefreshToken(request);
    // If no user (token invalid or missing), return 401
    if (user.status === 401) {
      return NextResponse.json(
        { status: false, message: "Unauthorized: Token missing or invalid" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const query = searchParams.get("query");
    const tab = searchParams.get("tab");
    const organisationId = searchParams.get("organisationId");

    const tabFilter =
      tab === "fishProducers"
        ? "Fish Producer"
        : tab === "feedSuppliers"
        ? "Feed Supplier"
        : null;

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
          createdAt: "desc",
        },
        where: baseWhereClause,
      });
    } else {
      organisations = await prisma.organisation.findMany({
        where: {
          OR: [
            { id: Number(organisationId) },
            { createdBy: Number(organisationId) },
          ],
          ...baseWhereClause,
        },
        include: { contact: true },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return new NextResponse(
      JSON.stringify({ status: true, data: organisations }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in /api/organisation:", error);
    return new NextResponse(
      JSON.stringify({ status: false, error: "Internal Server Error" }),
      { status: 500 }
    );
  }
};
