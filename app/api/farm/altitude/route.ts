import { verifyAndRefreshToken } from '@/app/_lib/auth/verifyAndRefreshToken';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${process.env.GOOGLE_API_KEY}`,
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch altitude' },
      { status: 500 },
    );
  }
}
