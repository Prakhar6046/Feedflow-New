import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  try {
    const { userId, password } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User id not found' }, { status: 400 });
    }
    const encryptedPassword = bcrypt.hashSync(password, 8);
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: encryptedPassword, invite: true },
    });

    // Return a success response
    return NextResponse.json({
      message: 'Password Created Successfully',
      status: true,
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }), {
      status: 500,
    });
  }
}
