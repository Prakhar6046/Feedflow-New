import { verifyAccessToken } from '@/app/_lib/jwt';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'No token' }, { status: 401 });

  const token = auth.split(' ')[1];

  try {
    const user = verifyAccessToken(token);
    return NextResponse.json({ message: 'This is protected', user });
  } catch {
    return NextResponse.json({ error: 'Token expired' }, { status: 401 });
  }
}
