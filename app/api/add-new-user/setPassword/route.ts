import prisma from '@/prisma/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export async function POST(req: NextRequest) {
  try {
    const { userId, password } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User id not found' }, { status: 400 });
    }
    const encryptedPassword = bcrypt.hashSync(password, 8);
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: encryptedPassword, invite: true },
    });

    // Return a success response
    return NextResponse.json({
      message: 'Password Created Successfully',
      status: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
