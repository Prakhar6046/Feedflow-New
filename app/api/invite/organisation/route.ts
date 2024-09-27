import { InvitationEmail } from "@/app/_lib/emailTemplate/invitationEmail";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { organisationId, users } = await req.json();

    const organisationExist = await prisma.organisation.findUnique({
      where: { id: organisationId },
    });
    if (!organisationExist) {
      return NextResponse.json(
        { error: "Organisation Not Found" },
        { status: 404 }
      );
    }
    const createdUsers = await prisma.contact.findMany({
      where: {
        email: {
          in: users.map((user: any) => user.email),
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
    createdUsers.map((user: any) => {
      InvitationEmail(user);
    });

    // Return a success response
    return NextResponse.json({
      message: "Email sent successfully",
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
