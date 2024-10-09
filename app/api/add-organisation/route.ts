import { capitalizeFirstLetter } from "@/app/_lib/utils";
import prisma from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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
        userId: null, // Initially set userId to null
      })),
    });

    // Create users and capture their IDs
    const createdUsers = await prisma.user.createMany({
      data: body.contacts.map((user: any) => ({
        email: user.email.toLowerCase(),
        name: capitalizeFirstLetter(user.name),
        organisationId: organisation.id,
      })),
    });

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

    // Send invitation emails to created users (if needed)
    // users.map((user) => {
    //   InvitationEmail(user);
    // });

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
