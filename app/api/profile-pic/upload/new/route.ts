import { NextRequest, NextResponse } from 'next/server';

import cloudinary from '@/lib/cloudinary';

export const POST = async (request: NextRequest) => {
  try {
    // Upload the image using multer
    const formData = await request.formData();
    const image = formData.get('image') as File | null;
    if (!image) {
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

    // Upload new image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'user_images',
    });

    return new NextResponse(
      JSON.stringify({ data: uploadResponse, status: true }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
