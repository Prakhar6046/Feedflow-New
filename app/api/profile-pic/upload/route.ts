// import prisma from "@/prisma/prisma";
// import { NextRequest, NextResponse } from "next/server";
//  import fs from "fs/promises";
// import path from "path";

// export const POST = async (request: NextRequest) => {
//   try {
//     // Upload the image using multer
//     const formData = await request.formData();
//     const image: any = formData.get("image");
//     const userId: any = formData.get("userId");
//     const oldImageName: any = formData.get("oldImageName");
//     const buffer = Buffer.from(await image.arrayBuffer());
//     const fileName = `${Date.now()}-${image.name}`;
//     const outputDir = path.join("/tmp", "uploads");
//     if (!fs.existsSync(outputDir)) {
//       await fs.mkdir(outputDir, { recursive: true }); // Make the directory asynchronously
//     }
//     const savePath = path.join(outputDir, fileName);

//     // const outputDir = path.join(__dirname, "..", "..", "uploads", "OutputFile");
//     // if (!fs.existsSync(outputDir)) {
//     //   fs.mkdirSync(outputDir, { recursive: true });
//     // }
//     // Delete old image if it exists
//     if (oldImageName && oldImageName !== "") {
//       const oldImagePath = path.join(outputDir, oldImageName);

//       try {
//         await fs.access(oldImagePath); // Check if the file exists
//         await fs.unlink(oldImagePath); // Delete the file
//         console.log(`Deleted old image: ${oldImagePath}`);
//       } catch (err: any) {
//         console.error(`Error deleting old image: ${err.message}`);
//       }
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: Number(userId) },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     await fs.writeFile(savePath, buffer);
//     const updatedUser = await prisma.user.update({
//       where: { id: Number(userId) },
//       data: {
//         image: fileName,
//         imageUrl:
//           `${process.env.BASE_URL}/api/profile-pic/${fileName}` ??
//           user.imageUrl,
//       },
//     });

//     return new NextResponse(
//       JSON.stringify({ data: updatedUser, status: true }),
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.log(error);

//     return new NextResponse(JSON.stringify({ error, status: false }), {
//       status: 500,
//     });
//   }
// };
import { promises as fs } from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/prisma/prisma";

export const POST = async (request: NextRequest) => {
  try {
    // Upload the image using multer
    const formData = await request.formData();
    const image: any = formData.get("image");
    const userId: any = formData.get("userId");
    const oldImageName: any = formData.get("oldImageName");
    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${Date.now()}-${image.name}`;
    const outputDir = path.join("/tmp", "uploads");

    // Check if directory exists, if not create it
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }

    const savePath = path.join(outputDir, fileName);

    // Delete old image if it exists
    if (oldImageName && oldImageName !== "") {
      const oldImagePath = path.join(outputDir, oldImageName);

      try {
        await fs.access(oldImagePath); // Check if the file exists
        await fs.unlink(oldImagePath); // Delete the file
        console.log(`Deleted old image: ${oldImagePath}`);
      } catch (err: any) {
        console.error(`Error deleting old image: ${err.message}`);
      }
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Write new image file
    await fs.writeFile(savePath, buffer);

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        image: fileName,
        imageUrl:
          `${process.env.BASE_URL}/api/profile-pic/${fileName}` ??
          user.imageUrl,
      },
    });

    return new NextResponse(
      JSON.stringify({ data: updatedUser, status: true }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return new NextResponse(JSON.stringify({ error, status: false }), {
      status: 500,
    });
  }
};
