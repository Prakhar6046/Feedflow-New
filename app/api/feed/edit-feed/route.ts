import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      throw new Error("Feed ID is required for updating.");
    }

    // const updateFeed
    return NextResponse.json({
      message: "Farm updated successfully",
      data: "",
      status: true,
    });
  } catch (error: any) {
    console.error("Error updating farm:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
