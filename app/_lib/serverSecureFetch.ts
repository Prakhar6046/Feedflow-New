import { cookies } from 'next/headers';

export const serverSecureFetch = async (url: string, options: RequestInit = {}) => {
  const cookieStore = cookies();
  let accessToken = cookieStore.get('auth-token')?.value;
  const refreshToken = cookieStore.get('refresh-token')?.value;

  console.log('[serverSecureFetch] URL:', url);
  console.log('[serverSecureFetch] Initial access token:', accessToken);
  console.log('[serverSecureFetch] Refresh token:', refreshToken);

  if (!accessToken && !refreshToken) {
    console.error('[serverSecureFetch] No tokens available');
    throw new Error('No tokens available');
  }

  const fetchWithAuth = async (token: string) => {
    console.log('[serverSecureFetch] Fetching with token:', token);
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  };

  // If no access token but have refresh token, get new access token first
  if (!accessToken && refreshToken) {
    console.log('[serverSecureFetch] No access token, using refresh token to get new access token');
    const refreshRes = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    console.log('[serverSecureFetch] Refresh token response status:', refreshRes.status);

    if (!refreshRes.ok) {
      console.error('[serverSecureFetch] Refresh token invalid');
      throw new Error('Refresh token invalid');
    }

    const data = await refreshRes.json();
    accessToken = data.accessToken;
    console.log('[serverSecureFetch] New access token received:', accessToken);

    // Set new access token in cookies
    cookieStore.set('auth-token', accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
    });
    console.log('[serverSecureFetch] Cookie updated with new access token');
  }

  // Now fetch with valid access token
  const res = await fetchWithAuth(accessToken!);
  console.log('[serverSecureFetch] Request status:', res.status);

  // If 401/403, try refreshing again
  if ((res.status === 401 || res.status === 403) && refreshToken) {
    console.warn('[serverSecureFetch] Access token expired, refreshing...');
    const refreshRes = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    if (!refreshRes.ok) throw new Error('Refresh token invalid');

    const data = await refreshRes.json();
    accessToken = data.accessToken;

    // Set new access token in cookies
    cookieStore.set('auth-token', accessToken, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
    });
    console.log('[serverSecureFetch] Cookie updated with new access token after 401/403');

    // Retry request
    const retryRes = await fetchWithAuth(accessToken);
    console.log('[serverSecureFetch] Retry request status:', retryRes.status);

    if (retryRes.status === 401 || retryRes.status === 403) {
      throw new Error('Unauthorized: Access token expired or invalid');
    }
    return retryRes;
  }

  return res;
};
