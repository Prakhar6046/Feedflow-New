'use server';
import { getValidAccessToken } from '../getValidAccessToken';

export const secureFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = await getValidAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  return res;
};
