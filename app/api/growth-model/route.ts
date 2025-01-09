import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role");
    const query = searchParams.get("query");

    //getting all growth models
    const growthModels = await prisma.growthModel.findMany({
      include: { models: true },
    });

    return new NextResponse(
      JSON.stringify({ status: true, data: growthModels }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    if (!body.organisationId) {
      return new NextResponse(
        JSON.stringify({ message: "Missing and Invalid orgainsation id" }),
        { status: 404 }
      );
    }

    if (!body.model) {
      return new NextResponse(
        JSON.stringify({
          message: "model data not found",
        }),
        { status: 404 }
      );
    }
    //creating new model
    const newModel = await prisma.model.create({
      data: body.model,
    });

    await prisma.growthModel.create({
      data: {
        organisationId: body.organisationId,
        modelId: newModel.id,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Growth model added succussfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new NextResponse(JSON.stringify(error), { status: 500 });
  }
};
