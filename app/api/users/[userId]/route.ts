import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  //   const { searchParams } = new URL(request.url);
  //   console.log(searchParams);
  const userId = context.params.userId;
  //   const userId = searchParams.get("userId");
  if (!userId) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid or missing userId" }),
      { status: 400 }
    );
  }
  try {
    const data = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: {
        Organisation: {
          select: {
            name: true,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
