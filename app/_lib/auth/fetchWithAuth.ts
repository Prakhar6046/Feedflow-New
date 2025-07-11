export async function fetchWithAuth(
  input: string,
  init: RequestInit = {},
  token?: string,
  retry = true,
  refreshToken?: string
): Promise<Response> {
  // Extract cookie header only on server-side

  const buildHeaders = (authToken?: string) => ({
    ...init.headers,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    "Content-Type": "application/json",
    cookie: refreshToken ? `refresh-token=${refreshToken}` : "",
  });

  let res = await fetch(input, {
    ...init,
    headers: buildHeaders(token),
  });

  // If unauthorized, try to refresh token using refresh-token cookie
  if (res.status === 401 && retry) {
    const refreshRes = await fetch(`${process.env.BASE_URL}/api/auth/refresh`, {
      method: "GET",
      headers: {
        cookie: refreshToken ? `refresh-token=${refreshToken}` : "",
      },
    });

    if (!refreshRes.ok) {
      throw new Error("Authentication failed. Please login again.");
    }

    const { accessToken: newToken } = await refreshRes.json();

    // Retry original request with new token
    res = await fetch(input, {
      ...init,
      headers: buildHeaders(newToken),
    });
  }

  return res;
}
