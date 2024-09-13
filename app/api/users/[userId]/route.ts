import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
export const GET = async (request: NextRequest, context: { params: any }) => {
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
        organisation: {
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

export async function PUT(req: NextRequest, context: { params: any }) {
  try {
    const userId = context.params.userId;

    // Check if a user exists
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upload the image using multer
    const formData = await req.formData();
    const image = formData.get("image");

    let imageUrl: string | undefined;

    // if (image) {
    //   // Ensure the upload directory exists
    //   const targetDir = path.resolve("./public/static/uploads");
    //   await fs.mkdir(targetDir, { recursive: true });

    //   const imagePath = path.join(targetDir, `${userId}-${Date.now()}.png`);
    //   await fs.writeFile(imagePath, Buffer.from(await image.arrayBuffer()));

    //   // Construct the image URL
    //   imageUrl = `${userId}-${Date.now()}.png`;
    // }

    // Update user with imageUrl
    // const newPassword = formData.get("password");
    // console.log(newPassword?.toString().length);

    // console.log(formData.get("password") as string);
    const newPassword = formData.get("password") as string;
    let encryptedPassword;
    let updateData;

    if (newPassword) {
      encryptedPassword = bcrypt.hashSync(newPassword, 8);
      updateData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        organisationId: Number(formData.get("organisationId") as string),
        password: encryptedPassword,
      };
    } else {
      updateData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        organisationId: Number(formData.get("organisationId") as string),
      };
    }
    // const updatedData = await prisma.user.update({
    //   where: { id: Number(userId) },
    //   data: {
    //     ...updateData,
    //     // image: imageUrl ?? user.image,
    //   },
    // });

    return new NextResponse(
      JSON.stringify({ message: "Profile successfully updated!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
