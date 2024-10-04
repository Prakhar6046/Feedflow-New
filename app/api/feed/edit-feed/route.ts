import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!body.id) {
      throw new Error("Feed ID is required for updating.");
    }
    const updatedFeed = await prisma.feedSupply.update({
      where: { id: body.id },
      data: rest,
    });
    // const updateFeed
    return NextResponse.json({
      message: "Feed updated successfully",
      data: updatedFeed,
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
