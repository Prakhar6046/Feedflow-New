import { cookies } from 'next/headers';

export const getValidAccessToken = async () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('auth-token')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;

  const res = await fetch(`${process.env.BASE_URL}/api/protected`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.ok) {
    return accessToken;
  }

  if (res.status === 401 && refreshToken) {
    console.log('[getValidAccessToken] Access token expired. Attempting refresh...');

    const refreshRes = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }), 
    });

    if (!refreshRes.ok) {
      throw new Error('Refresh token invalid');
    }

    const data = await refreshRes.json();
 

    if (data.accessToken) {
      return data.accessToken;
    }
    throw new Error('Unable to refresh access token');
  }

  throw new Error('No valid access or refresh token');
};
