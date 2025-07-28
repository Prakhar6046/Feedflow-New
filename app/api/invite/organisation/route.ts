import { SingleUser } from '@/app/_typeModels/User';
import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any other email service provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });
  try {
    const { organisationId, users, createdBy } = await req.json();

    const organisationExist = await prisma.organisation.findUnique({
      where: { id: organisationId },
      include: { contact: true },
    });
    const invitedByOrg = await prisma.organisation.findUnique({
      where: { id: Number(createdBy) },
      include: { contact: true },
    });
    const findOrganisationAdmin = invitedByOrg?.contact.find(
      (org) => org.permission === 'ADMIN' || org.permission === 'SUPERADMIN',
    );
    if (!organisationExist) {
      return NextResponse.json(
        { error: 'Organisation Not Found' },
        { status: 404 },
      );
    }

    const createdUsers = await prisma.contact.findMany({
      where: {
        email: {
          in: users.map((user: SingleUser) => user.email),
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        userId: true,
        invite: true,
      },
    });

    if (createdUsers.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 404 });
    }

    // Sending emails to all created users
    const emailPromises = createdUsers.map(async (user) => {
      if (!user.email) return;

      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender address
        to: user.email, // Recipient email
        subject: 'Welcome!', // Subject line
        text: `Hi ${user.name}, you are invited to join Feedflow.`, // Plain text body
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
      rel="stylesheet"
    />
    <title>Feedflow</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    </style>
  </head>
  <body>
    <div
      class="container"
      style="
        background-color: #f2f2f2;
        line-height: 1.7rem;
        font-family: 'Roboto', sans-serif;
        padding: 30px 0;
        height: 100vh !important;
        font-size: 18px;
      "
    >
      <div
        style="
          margin: 0 auto;
          max-width: 680px;
          width: 90%;
          background-color: white;
        "
      >
        <div style="padding: 18px 50px; display: flex">
          <img src="https://i.ibb.co/JN1NynZ/fulllogo.png" alt="Logo" width="200" />
        </div>
        <div style="background: url(https://i.ibb.co/tT8cdb7Q/emailbg.png); min-height: 240px">
          <h1
            style="
              color: #fff;
              line-height: 1.2;
              margin: 0 50px;
              padding-top: 90px;
            "
          >
         Hi, ${user.name}
          </h1>
        </div>
        <div style="padding: 30px 50px 60px 50px">
          <p style="margin: 16px 40px 10px 0">
            You’re invited by ${findOrganisationAdmin?.name}, from
            ${invitedByOrg?.name} to join Feedflow, a
            platform designed to support feeding management for aquaculture
            producers.
          </p>

          <div style="margin-top: 20px">
            <p>
              As a new user, you will gain access to tools that enable you to:
            </p>

            <ul style="padding-left: 16px">
              <li style="font-size: 16px; margin-top: 8px; line-height: 1.35">
                Plan and manage feeding and feed orders
              </li>

              <li style="font-size: 16px; margin-top: 8px; line-height: 1.35">
                Monitor feed usage and performance
              </li>

              <li style="font-size: 16px; margin-top: 4px; line-height: 1.35">
                Reduce feed waste and enhance operational efficiency
              </li>

              <li style="font-size: 16px; margin-top: 4px; line-height: 1.35">
                Make informed decisions based on real-time data and analytics
              </li>
            </ul>

            <p style="margin-top: 20px; margin-bottom: 8px">
              To begin, please activate your account using the link below:
            </p>

            <a href="${process.env.BASE_URL}/joinOrganisation/${user.userId}" style="color: #06a19b; font-size: 16px"
              >[Activate Your Feedflow Account]</a
            >
            <p style="margin-top: 8px; margin-bottom: 40px">
              Should you require any assistance during setup or usage, our
              support team is readily available to assist you.
            </p>
          </div>
          <!-- <p style="line-height: 2; font-size: 14px; margin-bottom: 40px">
            <a href="" style="color: #0d848e">Click here</a> To Join Now & Set
            Your Password
          </p> -->
          <p style="margin-bottom: 0px; font-weight: 600; color: #000">
            Kind regards,
          </p>
          <p style="margin: 0">${findOrganisationAdmin?.name}</p>
          <a
            href="#"
            target="_blank"
            style="text-decoration: none; font-size: 16px; color: #000"
            >${invitedByOrg?.name}</a
          >
        </div>
      </div>
    </div>
  </body>
</html>
`,
      };

      // Send the email and return the result
      return transporter.sendMail(mailOptions);
    });

    // Await all email promises to ensure completion
    await Promise.all(emailPromises);

    return NextResponse.json({
      message: 'Email sent successfully',
      status: true,
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
