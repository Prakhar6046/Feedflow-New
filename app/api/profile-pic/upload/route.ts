// import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import cloudinary from "@/lib/cloudinary";
import { verifyAndRefreshToken } from "@/app/_lib/auth/verifyAndRefreshToken";

export const POST = async (request: NextRequest) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: "Unauthorized: Token missing or invalid" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const image: any = formData.get("image");
    const userId: any = formData.get("userId");
    const oldImagePublicId: any = formData.get("oldImageName"); // Using public_id from Cloudinary

    // Convert image to base64
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = `data:${image.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Delete the old image from Cloudinary if provided
    if (oldImagePublicId && oldImagePublicId !== "") {
      try {
        await cloudinary.uploader.destroy(oldImagePublicId);
      } catch (err: any) {
        console.error(`Error deleting old image: ${err.message}`);
      }
    }

    // Upload new image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "user_images",
    });

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        image: uploadResponse.public_id, // Store Cloudinary's public_id
        imageUrl: uploadResponse.secure_url, // Store the secure URL
      },
    });

    return new NextResponse(
      JSON.stringify({ data: updatedUser, status: true }),
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
