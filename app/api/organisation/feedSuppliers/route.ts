import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organisationId = searchParams.get("organisationId");
    // console.log(organisationId);

    // const organisation = await prisma.organisation.findUnique({
    //   where: { id: Number(organisationId) },
    // });
    // if (!organisation) {
    //   return new NextResponse(
    //     JSON.stringify({ status: false, message: "Organisation not found" }),
    //     { status: 404 }
    //   );
    // }

    const hasFeedSupplierOrg = await prisma.organisation.findMany({
      where: { organisationType: "Feed Supplier" },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: hasFeedSupplierOrg }),
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
