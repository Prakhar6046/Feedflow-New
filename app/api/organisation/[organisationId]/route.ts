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

    // Check if a user exists
    const organisation = await prisma.organisation.findUnique({
      where: { id: Number(organisationId) },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    // Upload the image using multer
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const organisationCode = formData.get("organisationCode") as string;
    // const address = formData.get("address") as any;
    // const contacts = formData.get("contacts") as any;
    const addressData = JSON.parse(formData.get("address") as string);
    const contactsData = JSON.parse(formData.get("contacts") as string);
    const image = formData.get("image") as any;

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

    const updatedContact = await prisma.contact.upsert({
      where: { id: organisation.contactId || "" },
      update: {
        name: contactsData.name,
        role: contactsData.role,
        email: contactsData.email,
        phone: contactsData.phone,
      },
      create: {
        name: contactsData.name,
        role: contactsData.role,
        email: contactsData.email,
        phone: contactsData.phone,
        organisation: { connect: { id: organisation.id } },
      },
    });

    const updatedOrganisation = await prisma.organisation.update({
      where: { id: Number(organisationId) },
      data: {
        name: name || organisation.name,
        organisationCode: organisationCode || organisation.organisationCode,
        addressId: updatedAddress.id,
        contactId: updatedContact.id,
        image: image || null,
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
