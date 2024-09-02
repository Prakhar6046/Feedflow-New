import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { content, title } = await request.json();
    const result = await prisma.post.create({
      data: {
        title,
        content,
        published: true,
        author: {
          create: {
            name: "Abhishek",
          },
        },
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};
