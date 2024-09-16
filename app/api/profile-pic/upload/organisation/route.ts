import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
export const POST = async (request: NextRequest) => {
  try {
    // Upload the image using multer
    const formData = await request.formData();
    const image: any = formData.get("image");
    const organisationId: any = formData.get("organisationId");
    const oldImageName: any = formData.get("oldImageName");
    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${Date.now()}-${image.name}`;
    const savePath = path.join("./public/static/uploads/", fileName);
    // Delete old image if it exists
    if (oldImageName && oldImageName !== "") {
      const oldImagePath = path.join("./public/static/uploads/", oldImageName);

      try {
        await fs.access(oldImagePath); // Check if the file exists
        await fs.unlink(oldImagePath); // Delete the file
        console.log(`Deleted old image: ${oldImagePath}`);
      } catch (err: any) {
        console.error(`Error deleting old image: ${err.message}`);
      }
    }

    const organisation = await prisma.user.findUnique({
      where: { id: Number(organisationId) },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    await fs.writeFile(savePath, buffer);
    const updatedUser = await prisma.organisation.update({
      where: { id: Number(organisationId) },
      data: {
        image: fileName,
        imageUrl:
          `${process.env.BASE_URL}/api/profile-pic/${fileName}` ??
          organisation.imageUrl,
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
