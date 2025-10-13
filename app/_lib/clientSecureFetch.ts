import { getCookie, setCookie } from 'cookies-next';

export const clientSecureFetch = async (url: string, options: RequestInit = {}) => {
  let accessToken = getCookie('auth-token') as string | undefined;
  const refreshToken = getCookie('refresh-token') as string | undefined;

  console.log('[clientSecureFetch] Initial access token:', accessToken);
  console.log('[clientSecureFetch] Refresh token:', refreshToken);

  if (!accessToken && !refreshToken) {
    console.error('[clientSecureFetch] No tokens available');
    throw new Error('No tokens available');
  }

  const fetchWithAuth = async (token?: string) => {
    console.log('[clientSecureFetch] Fetching URL with token:', token);
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json',
      },
      credentials: 'include', // important for cookie-based auth
    });
  };

  // First attempt
  let res = await fetchWithAuth(accessToken);
  console.log('[clientSecureFetch] Initial request status:', res.status);

  // If 401/403, try refreshing
  if ((res.status === 401 || res.status === 403) && refreshToken) {
    console.warn('[clientSecureFetch] Access token expired, refreshing...');

    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    if (!refreshRes.ok) {
      console.error('[clientSecureFetch] Refresh token invalid');
      throw new Error('Refresh token invalid');
    }

    const data = await refreshRes.json();
    accessToken = data.accessToken;
    console.log('[clientSecureFetch] New access token:', accessToken);

    // Update cookie (optional if your backend already sets it)
    setCookie('auth-token', accessToken, {
      httpOnly: false,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15,
    });

    res = await fetchWithAuth(accessToken);
    console.log('[clientSecureFetch] Retry request status:', res.status);
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('Unauthorized: Access token expired or invalid');
  }

  return res;
};
