import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { setCookie } from "cookies-next";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();
    // Normalize the email to lowercase
    const normalizedEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { organisation: { include: { Farm: true, contact: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    //check user has access
    if (!user.access) {
      return NextResponse.json(
        {
          error: `User is restricted from accessing the feedflow.`,
        },
        { status: 400 }
      );
    }

    // Check the password

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        {
          error:
            "Please check your email and create password to access feedflow",
        },
        { status: 404 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration time
    );
    setCookie("auth-token", token, { cookies });
    return new NextResponse(
      JSON.stringify({ status: true, data: { token, user } })
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }));
  }
};
