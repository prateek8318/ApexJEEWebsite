"use server";
import { cookies } from "next/headers";

export const getAuthToken = async () => {
  const token = (await cookies()).get("AUTH_TOKEN")?.value;
  return token;
};
