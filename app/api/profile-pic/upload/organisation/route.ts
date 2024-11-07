import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";
export const POST = async (request: NextRequest) => {
  try {
    // Upload the image using multer
    const formData = await request.formData();
    const image: any = formData.get("image");
    const organisationId: any = formData.get("organisationId");
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
        console.log(`Deleted old image: ${oldImagePublicId}`);
      } catch (err: any) {
        console.error(`Error deleting old image: ${err.message}`);
      }
    }

    // Upload new image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "user_images",
    });

    const organisation = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.organisation.update({
      where: { id: Number(organisationId) },
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
    console.log(error);

    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
