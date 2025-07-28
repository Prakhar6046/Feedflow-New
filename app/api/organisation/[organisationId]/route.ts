import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Contact } from '@/app/_typeModels/Organization';
interface ContextParams {
  params: {
    organisationId: string;
  };
}
export const GET = async (_request: NextRequest, context: ContextParams) => {
  const organisationId = context.params.organisationId;

  if (!organisationId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing organisationId' }),
      { status: 400 },
    );
  }
  try {
    const data = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
      include: {
        address: true,
        contact: true,
        users: true,
        hatchery: true,
        Farm: { include: { farmAddress: true, FarmManger: true } },
      },
    });
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
};

export async function PUT(req: NextRequest, context: ContextParams) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use any other email service provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });
    const organisationId = context.params.organisationId;

    // Check if the organisation exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
      include: { contact: true },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: 'Organisation not found' },
        { status: 404 },
      );
    }

    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const organisationCode = formData.get('organisationCode') as string;
    const organisationType = formData.get('organisationType') as string;
    const addressRaw = formData.get('address');
    const contactsRaw = formData.get('contacts');

    const addressData = addressRaw ? JSON.parse(addressRaw.toString()) : null;
    const contactsData = contactsRaw
      ? JSON.parse(contactsRaw.toString())
      : null;
    // const hatcheryId = JSON.parse(formData.get('hatcheryId') as string);
    const hatchery = JSON.parse(formData.get('hatchery') as string);
    const imageUrl = formData.get('imageUrl') as string;
    const invitedById = formData.get('invitedBy') as string;
    const invitedByOrg = await prisma.organisation.findUnique({
      where: { id: Number(invitedById) },
      include: { contact: true },
    });

    const findOrganisationAdmin = invitedByOrg?.contact.find(
      (org) => org.permission === 'ADMIN' || org.permission === 'SUPERADMIN',
    );
    const checkContactExist = contactsData
      .filter((contact: Contact) => !contact.id)
      .map((contact: Contact) => contact.email)
      .filter((email: string | null | undefined): email is string =>
        Boolean(email),
      );

    // check user exist with contact email
    const users = await prisma.user.findMany({
      where: { email: { in: checkContactExist } },
    });

    if (users.length) {
      return NextResponse.json(
        { error: 'User already exist with some email' },
        { status: 409 },
      );
    }
    // Handle address update or create
    const updatedAddress = await prisma.address.upsert({
      where: { id: organisation.addressId || '' },
      update: {
        name: addressData.address,
        street: addressData.street,
        city: addressData.city,
        province: addressData.province,
        postCode: addressData.postCode,
        country: addressData.country,
      },
      create: {
        name: addressData.address,
        street: addressData.street,
        city: addressData.city,
        province: addressData.province,
        postCode: addressData.postCode,
        country: addressData.country,
        organisation: { connect: { id: organisation.id } },
      },
    });
    if (hatchery) {
      // const updatedHatchery = await prisma.hatchery.upsert({
      //   where: { id: hatcheryId || '' },
      //   update: {
      //     name: hatchery.name,
      //     altitude: hatchery.altitude,
      //     code: hatchery.code,
      //     fishSpecie: hatchery.fishSpecie,
      //   },
      //   create: {
      //     name: hatchery.name ?? '',
      //     altitude: hatchery.altitude ?? '',
      //     code: hatchery.code ?? '',
      //     fishSpecie: hatchery.fishSpecie ?? '',
      //     createdBy: organisation.id,
      //   },
      // });
    }

    // Handle contacts update or create
    for (const contact of contactsData) {
      let userId = contact.userId;
      const shouldSendInvite = contact.newInvite;

      // If contact has no id, it's a new contact
      if (!contact.id) {
        // If userId is not provided, find or create a user
        if (!userId) {
          const user = await prisma.user.findUnique({
            where: { email: contact.email },
            select: { id: true },
          });

          if (user) {
            userId = user.id;
            // Update user's email if it's different
          } else {
            // If the user doesn't exist, create a new one and get the ID
            const newUser = await prisma.user.create({
              data: {
                email: contact.email,
                name: contact.name,
                organisationId: Number(organisationId),
                invite: shouldSendInvite ? shouldSendInvite : false,
              },
              select: { id: true },
            });
            userId = newUser.id;
          }
        }

        // Create the new contact with the userId
        await prisma.contact.create({
          data: {
            name: contact.name,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
            permission: contact.permission,
            userId,
            organisation: { connect: { id: organisation.id } },
            invite: contact.newInvite,
          },
        });
      } else {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { email: contact?.email, name: contact?.name },
        });
        // If contact exists (has an id), update the contact information
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            name: contact.name,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
            userId,
            permission: contact.permission,
            invite: contact.newInvite,
          },
        });
      }

      if (shouldSendInvite) {
        // Sending emails
        const mailOptions = {
          from: process.env.EMAIL_USER, // Sender address
          to: contact.email, // Recipient email
          subject: 'Welcome!', // Subject line
          text: `Hi ${contact.name}, you are invited to join Feedflow.`, // Plain text body
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
         Hi, ${contact.name}
          </h1>
        </div>
        <div style="padding: 30px 50px 60px 50px">
          <p style="margin: 16px 40px 10px 0">
            You're invited by ${findOrganisationAdmin?.name}, from
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

            <a href="${process.env.BASE_URL}/joinOrganisation/${userId}" style="color: #06a19b; font-size: 16px"
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
          <p style="margin: 0">Everett Pieterse</p>
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

        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.error('Failed to send email to', contact.email, error);
        }
      }
    }

    //deleting contact
    const existingContacts = await prisma.contact.findMany({
      where: { organisationId: Number(organisationId) },
      select: { id: true, email: true },
    });

    const updatedContacts = contactsData.map((contact: Contact) => {
      const c = existingContacts.find((ex) => ex.email === contact.email);
      if (c?.email === contact.email) {
        return { ...contact, id: c?.id };
      } else {
        return contact;
      }
    });

    const updatedContactIds = updatedContacts
      .map((contact: Contact) => contact.id)
      .filter((id: number): id is number => id !== undefined && id !== null); // ✅ type guard

    const contactsToDelete = existingContacts
      .filter((contact) => !updatedContactIds.includes(contact.id))
      .map((contact) => contact.id);

    const usersToDelete: any = existingContacts
      .filter((contact) => !updatedContactIds.includes(contact.id))
      .map((contact) => contact.email);

    // Delete the removed contacts
    if (contactsToDelete.length > 0 || usersToDelete.length > 0) {
      await prisma.contact.deleteMany({
        where: { id: { in: contactsToDelete } },
      });
      await prisma.user.deleteMany({
        where: { email: { in: usersToDelete } },
      });
    }
    // Update organisation details
    await prisma.organisation.update({
      where: { id: Number(organisationId) },
      data: {
        name: name || organisation.name,
        organisationCode: organisationCode || organisation.organisationCode,
        addressId: updatedAddress.id,
        organisationType: organisationType || organisation.organisationType,
        imageUrl: imageUrl || organisation.imageUrl,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: 'Organisation successfully updated!' }),
      { status: 200 },
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
