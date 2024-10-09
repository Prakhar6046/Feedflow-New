import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, context: { params: any }) => {
  const organisationId = context.params.organisationId;

  if (!organisationId) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid or missing organisationId" }),
      { status: 400 }
    );
  }
  try {
    const data = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
      include: { address: true, contact: true },
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

export async function PUT(req: NextRequest, context: { params: any }) {
  try {
    const organisationId = context.params.organisationId;

    // Check if the organisation exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const organisationCode = formData.get("organisationCode") as string;
    const organisationType = formData.get("organisationType") as string;
    const addressData = JSON.parse(formData.get("address") as string);
    const contactsData = JSON.parse(formData.get("contacts") as string);

    // Handle address update or create
    const updatedAddress = await prisma.address.upsert({
      where: { id: organisation.addressId || "" },
      update: {
        name: addressData.address,
        street: addressData.street,
        city: addressData.city,
        province: addressData.province,
        postCode: addressData.postCode,
      },
      create: {
        name: addressData.address,
        street: addressData.street,
        city: addressData.city,
        province: addressData.province,
        postCode: addressData.postCode,
        organisation: { connect: { id: organisation.id } },
      },
    });

    // Handle contacts update or create
    for (const contact of contactsData) {
      let userId = contact.userId;

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
            userId: String(userId), // Associate the new userId with the contact
            organisation: { connect: { id: organisation.id } },
          },
        });
      } else {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: { email: contact.email },
        });
        // If contact exists (has an id), update the contact information
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            name: contact.name,
            role: contact.role,
            email: contact.email,
            phone: contact.phone,
            userId: String(userId), // Keep the userId association
          },
        });
      }
    }

    // Update organisation details
    const updatedOrganisation = await prisma.organisation.update({
      where: { id: Number(organisationId) },
      data: {
        name: name || organisation.name,
        organisationCode: organisationCode || organisation.organisationCode,
        addressId: updatedAddress.id,
        organisationType: organisationType || organisation.organisationType,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Organisation successfully updated!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
