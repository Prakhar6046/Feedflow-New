import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { setCookie } from "cookies-next";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export async function POST(req: NextRequest) {
  try {
    const { userId, password } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User id not found" }, { status: 400 });
    }
    const encryptedPassword = bcrypt.hashSync(password, 8);
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: encryptedPassword },
    });
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration time
    );
    setCookie("auth-token", token, { cookies });
    // Return a success response
    return NextResponse.json({
      data: user,
      token,
      status: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
