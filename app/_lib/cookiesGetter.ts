"use server";

import { cookies } from "next/headers";

export async function GetToken() {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    return;
  }

  return token;
}
