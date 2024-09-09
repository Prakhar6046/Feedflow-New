import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const organisations = await prisma.user.findMany({
      include: {
        organisation: {
          select: {
            name: true,
          },
        },
      },
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
