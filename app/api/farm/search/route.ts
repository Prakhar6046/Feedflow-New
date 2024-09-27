import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const query = request.nextUrl.searchParams;
    const searchQuery = query.get("name");

    const farms = await prisma.farm.findMany({
      where: searchQuery
        ? {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          }
        : {},
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
