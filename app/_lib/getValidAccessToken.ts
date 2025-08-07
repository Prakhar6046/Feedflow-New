import { cookies } from 'next/headers';

export const getValidAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('auth-token')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;

  const res = await fetch(`${process.env.BASE_URL}/api/protected`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // If token is expired
  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(refreshToken),
    });

    if (!refreshRes.ok) throw new Error('Refresh token invalid');

    const data = await refreshRes.json();

    if (data.accessToken) {
      // Store access token in cookie (not HTTP-only)
      //   cookieStore.set('auth-token', data.accessToken, {
      //     maxAge: 60 * 15, // 15 mins
      //     path: '/',
      //   });

      return data.accessToken;
    }

    throw new Error('Could not refresh access token');
  }

  return accessToken?.toString();
};
