// import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import cloudinary from '@/lib/cloudinary';

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    const userId = formData.get('userId') as string | null;
    const oldImagePublicId = formData.get('oldImageName') as string | null;
    if (!image || !userId) {
      return NextResponse.json(
        { status: false, message: 'Missing image or userId' },
        { status: 400 },
      );
    }
    // Convert image to base64
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64Image = `data:${image.type};base64,${buffer.toString(
      'base64',
    )}`;

    // Delete the old image from Cloudinary if provided
    if (oldImagePublicId && oldImagePublicId !== '') {
      try {
        await cloudinary.uploader.destroy(oldImagePublicId);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(`Error deleting old image: ${err.message}`);
        } else {
          console.error('Unknown error while deleting old image:', err);
        }
      }
    }

    // Upload new image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'user_images',
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
      },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
