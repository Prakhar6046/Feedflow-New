"use server";

import { cookies } from "next/headers";

export const GetToken = async () => {
  const token = cookies().get("auth-token")?.value;

  if (!token) {
    return;
    throw new Error("Not authenticated");
  }
  console.log(token);

  return token;
};
