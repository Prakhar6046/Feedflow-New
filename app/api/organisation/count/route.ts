import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAndRefreshToken } from "@/app/_lib/auth/verifyAndRefreshToken";

export const GET = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: "Unauthorized: Token missing or invalid" },
      { status: 401 }
    );
  }

  try {
    const organisationCount = await prisma.organisationCount.findUnique({
      where: { id: 1 },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: organisationCount?.count }),
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
