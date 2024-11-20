import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const fishSupply = await prisma.fishSupply.findMany({});
    return new NextResponse(
      JSON.stringify({
        status: true,
        data: fishSupply,
      })
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
