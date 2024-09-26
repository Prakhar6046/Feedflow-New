import { InvitationEmail } from "@/app/_lib/emailTemplate/invitationEmail";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // if (!email) {
    //   return NextResponse.json({ error: "Email is required" }, { status: 400 });
    // }

    const address = await prisma.address.create({
      data: {
        city: body.city ?? "",
        postCode: body.postCode ?? "",
        province: body.province ?? "",
        name: body.address ?? "",
      },
    });

    const results = await prisma.organisation.create({
      data: {
        name: body.organisationName,
        organisationCode: body.organisationCode,
        addressId: address.id,
      },
    });
    const contacts = await prisma.contact.createMany({
      data: body.contacts.map((contact: any) => ({
        ...contact,
        organisationId: results.id,
      })),
    });
    const newUsers = body.contacts.map((user: any) => {
      return {
        email: user.email,
        name: user.name,
        organisationId: Number(results.id),
      };
    });

    await prisma.user.createMany({
      data: newUsers,
    });

    // Retrieve users with their IDs
    const createdUsers = await prisma.user.findMany({
      where: {
        email: {
          in: newUsers.map((user: any) => user.email),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        // Add any other fields you need
      },
    });

    //Sending emails to all created users
    createdUsers.map((user) => {
      InvitationEmail(user);
    });

    return NextResponse.json({
      message: "Email sent successfully",
      data: { results, newUsers },
      status: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
