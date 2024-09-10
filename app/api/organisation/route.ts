import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const organisationId = searchParams.get("organisationId");
    let organisations;
    if (role === "SUPERADMIN") {
      organisations = await prisma.organisation.findMany({});
    } else {
      organisations = await prisma.organisation.findMany({
        where: { id: Number(organisationId) },
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
