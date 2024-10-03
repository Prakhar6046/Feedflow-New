import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = request.json();
    return new NextResponse(JSON.stringify({ status: true, data: body }));
  } catch (error) {
    console.error("Error creating organisation or users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
