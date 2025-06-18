// import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prisma";
import cloudinary from "@/lib/cloudinary";
export const POST = async (request: NextRequest) => {
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

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with Cloudinary image data
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
