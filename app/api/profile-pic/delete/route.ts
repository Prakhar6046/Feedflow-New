import cloudinary from "@/lib/cloudinary";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { verifyAndRefreshToken } from "@/app/_lib/auth/verifyAndRefreshToken";

export const DELETE = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: "Unauthorized: Token missing or invalid",
      }),
      { status: 401 }
    );
  }
  try {
    const body = await request.json();
    const id = Number(body.id);
    const type = body.type;
    const public_id = body.image;
    if (!public_id) {
      return new NextResponse(
        JSON.stringify({ message: "Missing or invalid image name" })
      );
    }
    if (type === "user" && id) {
      await prisma.user.update({
        where: { id },
        data: { image: null, imageUrl: null },
      });
    } else if (id) {
      await prisma.organisation.update({
        where: { id },
        data: { image: null, imageUrl: null },
      });
    }
    if (public_id && public_id !== "") {
      try {
        await cloudinary.uploader.destroy(public_id);
      } catch (err: any) {
        console.error(`Error deleting image: ${err.message}`);
      }
    }
    return new NextResponse(
      JSON.stringify({ message: "Image delete successfully", status: true }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
