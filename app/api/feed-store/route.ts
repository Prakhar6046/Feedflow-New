import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const organisationId = searchParams.get("organisationId");
    const query = searchParams.get("query");

    const feedStores = await prisma.feedStore.findMany({
      orderBy: {
        createdAt: "desc", // Sort by createdAt in descending order
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        data: feedStores,
      })
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
