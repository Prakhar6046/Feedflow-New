import { capitalizeFirstLetter } from "@/app/_lib/utils";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const transporter: any = nodemailer.createTransport({
      service: "gmail", // You can use any other email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });
    const body = await req.json();
    const checkContactExist = body.contacts
      .filter((contact: any) => !contact.id)
      .map((contact: any) => contact.email)
      .filter((email: string | null | undefined): email is string =>
        Boolean(email)
      );

    // check user exist with contact email
    const existUsers = await prisma.user.findMany({
      where: { email: { in: checkContactExist } },
    });

    if (existUsers.length) {
      return NextResponse.json(
        { error: "User already exist with some email" },
        { status: 409 }
      );
    }
    // Create address
    const address = await prisma.address.create({
      data: {
        city: body.city ?? "",
        postCode: body.postCode ?? "",
        province: body.province ?? "",
        name: capitalizeFirstLetter(body.address) ?? "",
        country: body.country ?? "",
      },
    });

    // Create organisation
    const organisation = await prisma.organisation.create({
      data: {
        name: body.organisationName,
        organisationCode: body.organisationCode,
        organisationType: body.organisationType,
        addressId: address.id,
        imageUrl: body.imageUrl,
        createdBy: body.createdBy,
      },
    });

    // Create contacts without userId initially
    const contacts = await prisma.contact.createMany({
      data: body.contacts.map((contact: any) => ({
        name: capitalizeFirstLetter(contact.name),
        email: contact.email.toLowerCase(),
        phone: contact.phone,
        role: contact.role,
        organisationId: organisation.id,
        permission: contact.permission,
        userId: null,
        invite: contact.newInvite,
      })),
    });

    // Create users and capture their IDs
    for (const contact of body.contacts) {
      const shouldSendInvite = contact.newInvite;
      const createdUser = await prisma.user.create({
        data: {
          email: contact.email.toLowerCase(),
          name: capitalizeFirstLetter(contact.name),
          organisationId: organisation.id,
          role: contact.permission?.toUpperCase(),
          invite: shouldSendInvite ? shouldSendInvite : false,
        },
      });

      const userId = createdUser.id;
      if (shouldSendInvite) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: contact.email,
          subject: "Welcome!",
          text: `Hi ${contact.name}, you are invited to join Feedflow.`,
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
      *{
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
        <div style="padding: 18px 50px;display: flex;">
          <img src="https://i.ibb.co/dKTVMh7/logo.png" alt="Logo" />
        </div>
        <div
          style="
           background:url(https://i.ibb.co/tT8cdb7Q/emailbg.png);
            min-height: 240px;
            position: relative
          "
        >
          <h1 style="color: #fff; line-height: 1.2; margin: 0 50px; position: absolute; tranform: translate(0, -50%); top: 50%>
            Hi ${contact.name}
          </h1>
        </div>
        <div style="padding: 30px 50px 60px 50px">
          
          <p style="margin: 20px 40px 10px 0">
            You're invited to join Feedflow, the platform designed to streamline your workflow and keep everything running smoothly.
          </p>
          <p style="line-height: 2; font-size: 14px; margin-bottom: 32px;"> <a href="${process.env.BASE_URL}/joinOrganisation/${userId}" style="color: #0d848e;">Click here</a> To Join Now & Set Your Password </p>
          <p style="margin-bottom: 5px">Thanks,</p>
          <a
            href="#"
            target="_blank"
            style="text-decoration: none; font-weight: 600; color: #000"
            >The Team Feedflow</a
          >
        </div>
        
      </div>
    </div>

   

    
  </body>
</html>`,
        };

        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error("Failed to send email to", contact.email, error);
        }
      }
    }

    // await prisma.user.createMany({
    //   data: body.contacts.map((user: any) => ({
    //     email: user.email.toLowerCase(),
    //     name: capitalizeFirstLetter(user.name),
    //     organisationId: organisation.id,
    //     role: user.permission?.toUpperCase(),
    //   })),

    // });

    // Fetch the created users to get their IDs
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: body.contacts.map((contact: any) => contact.email.toLowerCase()),
        },
      },
      select: { id: true, email: true },
    });

    // Update contacts with the corresponding userId
    await Promise.all(
      users.map(async (user) => {
        await prisma.contact.updateMany({
          where: { email: user.email.toLowerCase() },
          data: { userId: String(user.id) },
        });
      })
    );

    if (body.hatcheryName) {
      await prisma.hatchery.create({
        data: {
          name: body.hatcheryName ?? "",
          altitude: body.hatcheryAltitude ?? "",
          code: body.hatcheryCode ?? "",
          fishSpecie: body.fishSpecie ?? "",
          createdBy: organisation.id,
        },
      });
    }

    //increase orgainsation count
    await prisma.organisationCount.upsert({
      where: { id: 1 },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        id: 1,
        count: 1,
      },
    });

    return NextResponse.json({
      message: "Organisation added successfully",
      data: { organisation, contacts, users },
      status: true,
    });
  } catch (error) {
    console.error("Error creating organisation or users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
