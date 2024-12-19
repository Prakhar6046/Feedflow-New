import { InvitationEmail } from "@/app/_lib/emailTemplate/invitationEmail";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any other email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

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
        userId: true,
      },
    });

    if (createdUsers.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Sending emails to all created users
    const emailPromises = createdUsers.map(async (user: any) => {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: user.email, // Recipient email
        subject: "Welcome!", // Subject line
        text: `Hi ${user.name}, you are invited to join Feedflow.`, // Plain text body
        html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Invitation Email</title>
          </head>
          <body style="margin: 0">
            <div
              class="container"
              style="background-color: #f2f2f2; line-height: 1.7rem; font-family: 'Arial', sans-serif; padding: 25px 0px; height: 100vh !important; font-size: 18px;">
              <div class="main" style="margin: 0 auto; max-width: 650px; width: 90%">
                <div class="main-content" style="background: #fff; padding: 30px 20px; margin-top: 10px; box-shadow: 0 0 10px lightgray; border-radius: 10px;">
                  <img src="https://i.ibb.co/dKTVMh7/logo.png" alt="Logo" class="logo-img" style="width: 200px; margin-bottom: 20px" />
                  <h3 class="m-0" style="margin: 0">Hi ${user.name}</h3>
                  <p class="m-0" style="margin: 10px 0">You are invited to join Feedflow.</p>
                  <p style="line-height: 1.4; font-size: 16px; color: #505050; margin: 0">
                    <a href="${process.env.BASE_URL}/joinOrganisation/${user.userId}">Click here</a> to join and set your password.
                  </p>
                  <div style="margin-block: 15px; border: 1px solid #ededed"></div>
                  <p style="font-size: 16px; font-weight: 600; margin: 0">Thanks,</p>
                  <p style="margin: 0">Team Feedflow</p>
                </div>
              </div>
            </div>
          </body>
        </html>`,
      };

      // Send the email and return the result
      return transporter.sendMail(mailOptions);
    });

    // Await all email promises to ensure completion
    await Promise.all(emailPromises);

    return NextResponse.json({
      message: "Email sent successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
