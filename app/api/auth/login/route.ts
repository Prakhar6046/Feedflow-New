import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { setCookie } from "cookies-next";

const JWT_SECRET = process.env.JWT_SECRET || "access-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "refresh-secret-key";

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { organisation: { include: { Farm: true, contact: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.access) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!user.password || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate tokens
    const payload = { id: user.id, email: user.email };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      status: true,
      data: { token: accessToken, user },
    });
    cookies().set("auth-token", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1 * 1,
    });
    // Set refresh token cookie
    cookies().set("refresh-token", refreshToken, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1, // 1 day
    });

    return response;
  } catch (error) {
    return NextResponse.json({ status: false, error }, { status: 500 });
  }
};
