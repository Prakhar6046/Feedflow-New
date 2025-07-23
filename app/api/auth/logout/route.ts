import { deleteCookie } from 'cookies-next';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export const GET = async () => {
  try {
    deleteCookie('auth-token', { cookies });
    deleteCookie('refresh-token', { cookies });

    deleteCookie('role', { cookies });
    return new NextResponse(
      JSON.stringify({ status: true, message: 'Logout Successfully' }),
    );
  } catch (error) {
    return new NextResponse(JSON.stringify({ status: false, error }));
  }
};
