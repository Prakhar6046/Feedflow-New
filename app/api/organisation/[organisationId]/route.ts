import prisma from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Contact } from '@/app/_typeModels/Organization';
import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
interface ContextParams {
  params: {
    organisationId: string;
  };
}
export const DELETE = async (request: NextRequest, context: ContextParams) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: 'Unauthorized: Token missing or invalid',
      }),
      { status: 401 },
    );
  }
  const organisationId = context.params.organisationId;

  if (!organisationId) {
    return new NextResponse(
      JSON.stringify({ message: 'Invalid or missing organisationId' }),
      {
        status: 400,
      },
    );
  }

  try {
    // Delete organisation and cascade related tables if necessary
    await prisma.$transaction([
      prisma.contact.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.user.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.hatchery.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.farm.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.feedSupply.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.model.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.growthModel.deleteMany({
        where: { organisationId: Number(organisationId) },
      }),
      prisma.organisation.delete({ where: { id: Number(organisationId) } }),
    ]);

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: 'Organisation and related records deleted successfully',
      }),
      { status: 200 },
    );
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
    } else {
      errorMessage = String(error);
    }

    return new NextResponse(
      JSON.stringify({ status: false, error: errorMessage }),
      {
        status: 500,
      },
    );
  }
};
export const GET = async (request: NextRequest, context: ContextParams) => {
  const user = await verifyAndRefreshToken(request);
  if (user.status === 401) {
    return new NextResponse(
      JSON.stringify({
        status: false,
        message: 'Unauthorized: Token missing or invalid',
      }),
      { status: 401 },
    );
  }
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
        FishFarms: { include: { farmAddress: true, FarmManger: true } },
        advisors: {
          include: {
            advisor: {
              select: {
                id: true,
                name: true,
                email: true,
                organisationId: true,
                organisation: {
                  select: {
                    id: true,
                    name: true,
                    organisationType: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Combine farms from both relationships (owner and fish farmer)
    if (data) {
      const ownerFarms = data.Farm || [];
      const fishFarmerFarms = data.FishFarms || [];
      
      // Create a Set to avoid duplicates based on farm ID
      const farmMap = new Map();
      
      // Add owner farms
      ownerFarms.forEach(farm => {
        farmMap.set(farm.id, { ...farm, relationship: 'owner' });
      });
      
      // Add fish farmer farms (only if not already added as owner)
      fishFarmerFarms.forEach(farm => {
        if (!farmMap.has(farm.id)) {
          farmMap.set(farm.id, { ...farm, relationship: 'fishFarmer' });
        }
      });
      
      // Convert back to array and update the data
      data.Farm = Array.from(farmMap.values());
      delete data.FishFarms; // Remove the separate FishFarms field
    }
    return new NextResponse(JSON.stringify({ status: true, data }), {
      status: 200,
    });
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
    } else {
      errorMessage = String(error);
    }
    return new NextResponse(
      JSON.stringify({ status: false, error: errorMessage }),
      {
        status: 500,
      },
    );
  }
};

export async function PUT(request: NextRequest, context: ContextParams) {

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
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const organisationCode = formData.get('organisationCode') as string;
    const organisationType = formData.get('organisationType') as string;
    const addressRaw = formData.get('address');
    const contactsRaw = formData.get('contacts');
    const hatcheryRaw = formData.get('hatchery');
    const hatcheryIdRaw = formData.get('hatcheryId');
    const allocatedAdvisorsRaw = formData.get('allocatedAdvisors');
    const advisorContactsRaw = formData.get('advisorContacts');
    const addressData = addressRaw ? JSON.parse(addressRaw.toString()) : null;
    const contactsData = contactsRaw
      ? JSON.parse(contactsRaw.toString())
      : null;
    const hatchery = hatcheryRaw ? JSON.parse(hatcheryRaw.toString()) : null;
    const hatcheryId = hatcheryIdRaw
      ? JSON.parse(hatcheryIdRaw.toString())
      : null;
    const imageUrl = formData.get('imageUrl') as string;
    const invitedById = formData.get('invitedBy') as string;
    const invitedByOrg = await prisma.organisation.findUnique({
      where: { id: Number(invitedById) },
      include: { contact: true },
    });
    const allocatedAdvisorInput = allocatedAdvisorsRaw
      ? JSON.parse(allocatedAdvisorsRaw.toString())
      : [];
    const advisorAssignments = Array.isArray(allocatedAdvisorInput)
      ? allocatedAdvisorInput
          .filter(
            (item: any) =>
              item &&
              typeof item.advisorId === 'number' &&
              !Number.isNaN(item.advisorId),
          )
          .reduce(
            (
              acc: Array<{ advisorId: number; accessLevel: number }>,
              item: any,
            ) => {
              const advisorId = Number(item.advisorId);
              if (!acc.some((existing) => existing.advisorId === advisorId)) {
                acc.push({
                  advisorId,
                  accessLevel: Number(item.accessLevel ?? 0),
                });
              }
              return acc;
            },
            [],
          )
      : [];

    // Helper function to get primary contact (Business manager, Feedflow Administrator, or SUPERADMIN)
    const getPrimaryContact = (contacts: any[]) => {
      if (!contacts || contacts.length === 0) return null;
      return (
        contacts.find((c) => c.permission === 'SUPERADMIN') ||
        contacts.find((c) => c.permission === 'Business manager') ||
        contacts.find((c) => c.permission === 'Feedflow Administrator (Admin)') ||
        contacts[0]
      );
    };
    const findOrganisationAdmin = invitedByOrg?.contact ? getPrimaryContact(invitedByOrg.contact) : null;
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
        { error: 'User already exist with same email' },
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
      await prisma.hatchery.upsert({
        where: { id: hatcheryId || '' },
        update: {
          name: hatchery.name,
          code: hatchery.code,
          altitude: hatchery.altitude,
          fishSpecie: hatchery.fishSpecie,
        },
        create: {
          name: hatchery.name,
          code: hatchery.code,
          altitude: hatchery.altitude,
          fishSpecie: hatchery.fishSpecie,
          createdBy: organisation.id,
          organisationId: organisation.id,
        },
      });
    }

    // Handle contacts update or create
    for (const contact of contactsData) {
      let userId = contact.userId;
      const shouldSendInvite = contact.newInvite;
      const userRole = contact.userType || contact.permission || contact.role || 'MEMBER';
      const modulePermissions =
        contact.permissions && typeof contact.permissions === 'object'
          ? contact.permissions
          : {};

      // If contact has no id, it's a new contact
      if (!contact.id) {
        // If userId is not provided, find or create a user
        if (!userId) {
          let user = await prisma.user.findUnique({
            where: { email: contact.email },
            select: { id: true },
          });

          if (user) {
            // Update user
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                email: contact.email,
                name: contact.name,
                role: userRole,
                inputRole: contact.inputRole || contact.role || '',
                permissions: modulePermissions,
                organisationId: organisation.id,
                invite: contact.newInvite || false,
              },
            });
            // Update user's email if it's different
          } else {
            // If the user doesn't exist, create a new one and get the ID
            const newUser = await prisma.user.create({
              data: {
                email: contact.email,
                name: contact.name,
                role: userRole,
                inputRole: contact.inputRole || contact.role || '',
                permissions: modulePermissions,
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
            inputRole: contact.inputRole || contact.role || '',
            email: contact.email,
            phone: contact.phone,
            permission: contact.permission || contact.userType || '',
            permissions: modulePermissions,
            user: {
              connect: { id: userId },
            },
            organisation: { connect: { id: organisation.id } },
            invite: contact.newInvite,
          },
        });
      } else {
        await prisma.user.update({
          where: { id: Number(userId) },
          data: {
            email: contact?.email,
            name: contact?.name,
            role: userRole,
            inputRole: contact.inputRole || contact.role || '',
            permissions: modulePermissions,
          },
        });
        // If contact exists (has an id), update the contact information
        await prisma.contact.update({
          where: { id: contact.id },
          data: {
            name: contact.name,
            role: contact.role,
            inputRole: contact.inputRole || contact.role || '',
            email: contact.email,
            phone: contact.phone,
            userId,
            permission: contact.permission || contact.userType || '',
            permissions: modulePermissions,
            invite: contact.newInvite,
          },
        });

        // If contact has advisor userType, ensure OrganisationAdvisor entry exists
        const contactUserType = contact.userType || contact.permission || '';
        if (contactUserType === 'Advisor: Technical services - adviser to Clients') {
          await prisma.organisationAdvisor.upsert({
            where: {
              organisationId_advisorId: {
                organisationId: Number(organisationId),
                advisorId: userId,
              },
            },
            update: {
              accessLevel: 3, // Default access level, can be updated later
            },
            create: {
              organisationId: Number(organisationId),
              advisorId: userId,
              accessLevel: 3,
            },
          });
        }
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

    // Handle advisor assignments (manually added advisors)
    if (advisorAssignments.length) {
      await Promise.all(
        advisorAssignments.map((assignment) =>
          prisma.organisationAdvisor.upsert({
            where: {
              organisationId_advisorId: {
                organisationId: Number(organisationId),
                advisorId: assignment.advisorId,
              },
            },
            update: {
              accessLevel: assignment.accessLevel,
            },
            create: {
              organisationId: Number(organisationId),
              advisorId: assignment.advisorId,
              accessLevel: assignment.accessLevel,
            },
          }),
        ),
      );
    }

    // Handle advisor contacts - create/update OrganisationAdvisor entries for contacts with advisor userType
    const advisorContacts = advisorContactsRaw
      ? JSON.parse(advisorContactsRaw.toString())
      : [];
    const advisorUserEntries: Array<{ organisationId: number; advisorId: number; accessLevel: number }> = [];
    
    if (advisorContacts.length > 0) {
      // Find users that match advisor contacts by email
      for (const advisorContact of advisorContacts) {
        const matchingUser = await prisma.user.findFirst({
          where: {
            email: advisorContact.email.toLowerCase(),
            organisationId: Number(organisationId),
          },
        });
        if (matchingUser) {
          advisorUserEntries.push({
            organisationId: Number(organisationId),
            advisorId: matchingUser.id,
            accessLevel: advisorContact.accessLevel || 3,
          });
        }
      }
      
      if (advisorUserEntries.length > 0) {
        await Promise.all(
          advisorUserEntries.map((entry) =>
            prisma.organisationAdvisor.upsert({
              where: {
                organisationId_advisorId: {
                  organisationId: entry.organisationId,
                  advisorId: entry.advisorId,
                },
              },
              update: {
                accessLevel: entry.accessLevel,
              },
              create: {
                organisationId: entry.organisationId,
                advisorId: entry.advisorId,
                accessLevel: entry.accessLevel,
              },
            }),
          ),
        );
      }
    }

    // Delete advisors that are no longer in the list
    // But keep advisor contacts that are still in contacts
    const allAdvisorIds = [
      ...advisorAssignments.map((a) => a.advisorId),
      ...advisorUserEntries.map((e) => e.advisorId),
    ];

    await prisma.organisationAdvisor.deleteMany({
      where: {
        organisationId: Number(organisationId),
        ...(allAdvisorIds.length
          ? {
              advisorId: {
                notIn: allAdvisorIds,
              },
            }
          : {}),
      },
    });

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
    console.error('Organisation PUT error:', error);
    let errorMessage = 'Unknown error';
    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
    } else {
      errorMessage = String(error);
    }
    return new NextResponse(
      JSON.stringify({ status: false, error: errorMessage }),
      { status: 500 },
    );
  }
}
