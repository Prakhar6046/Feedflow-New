import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any other email service provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});
export async function POST(req: NextRequest) {
  try {
    const { email, name, contactNumber, contactPerson } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    const results = await prisma.organisation.create({
      data: {
        name,
        contactNumber,
        contactPerson,
        userId: user.id,
      },
    });

    // Send the email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: email, // List of recipients
      subject: "Welcome!", // Subject line
      text: "Thank you for signing up!", // Plain text body
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
      style="
        background-color: #f2f2f2;
        line-height: 1.7rem;
        font-family: 'Arial', sans-serif;
        padding: 25px 0px;
        height: 100vh !important;
        font-size: 18px;
      "
    >
      <div class="main" style="margin: 0 auto; max-width: 650px; width: 90%">
        <div
          class="main-content"
          style="
            background: #fff;
            padding: 30px 20px;
            margin-top: 10px;
            box-shadow: 0 0 10px lightgray;
            border-radius: 10px;
          "
        >
          <img
            src="/static/img/logo-ensuesoft.jpg"
            alt="Logo"
            class="logo-img"
            style="width: 200px; margin-bottom: 20px"
          />

        

          <h3 class="m-0" style="margin: 0">Hi There!</h3>
          <p class="m-0" style="margin: 10px 0">
            Thank you for adding your organisation to nutrition hub.
          </p>
          <p
            style="line-height: 1.4; font-size: 16px; color: #505050; margin:0"
          >
Click here to <a href="${process.env.BASE_URL}/joinOrganisation/${user.id} >Continue</a> to set your password
          </p>
       
          <div style="margin-block: 15px; border: 1px solid #ededed"></div>
          <p style="font-size: 16px; font-weight: 600; margin: 0">Thanks,</p>
          <p style="margin: 0">
           Team Feedflow
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`,
    };

    const info = await transporter.sendMail(mailOptions);

    // Return a success response
    return NextResponse.json({
      message: "Email sent successfully",
      info: info.response,
      data: results,
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
