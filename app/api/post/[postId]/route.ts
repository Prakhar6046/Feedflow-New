import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export const DELETE = async (request: Request, { params }: any) => {
  try {
    const id = params.postId;
    // log

    const post = await prisma.post.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ status: true, data: post }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
