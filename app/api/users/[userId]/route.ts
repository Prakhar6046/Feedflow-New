import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAndRefreshToken } from "@/app/_lib/auth/verifyAndRefreshToken";

export const GET = async (request: NextRequest, context: { params: any }) => {
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
  const userId = context.params.userId;
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
            organisationType: true,
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
  const user = await verifyAndRefreshToken(req);
  if (user.status === 401) {
    return NextResponse.json(
      { status: false, message: "Unauthorized: Token missing or invalid" },
      { status: 401 }
    );
  }
  try {
    const userId = context.params.userId;

    // Check if a user exists
    const userData = await prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { Contact: true },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upload the image using multer
    const formData: any = await req.formData();

    const permissions = JSON.parse(formData.get("permissions"));
    const newPassword = formData.get("password") as string;
    let encryptedPassword;
    let updateData;

    if (newPassword) {
      encryptedPassword = bcrypt.hashSync(newPassword, 8);
      updateData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        organisationId: Number(formData.get("organisationId") as string),
        permissions: permissions ?? {},
        password: encryptedPassword,
      };
    } else {
      updateData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        imageUrl: formData.get("imageUrl") as string,
        organisationId: Number(formData.get("organisationId") as string),
        permissions: permissions ?? {},
      };
    }
    await prisma.contact.update({
      where: { userId: Number(userId), id: userData?.Contact[0].id },
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
      },
    });
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        ...updateData,
      },
    });

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
