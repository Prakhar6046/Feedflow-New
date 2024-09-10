import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const query = request.nextUrl.searchParams;
    const searchQuery = query.get("name");

    const organisations = await prisma.organisation.findMany({
      where: searchQuery
        ? {
            name: {
              contains: searchQuery,
              mode: "insensitive", // Optional: Makes the search case-insensitive
            },
          }
        : {}, // If searchQuery is empty, no filtering will be applied
    });
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
