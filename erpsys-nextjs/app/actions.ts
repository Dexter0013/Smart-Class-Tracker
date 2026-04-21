"use server";

import { getAuthUser } from "@/lib/auth";

export async function checkAuthAction() {
  try {
    const user = await getAuthUser();
    return user;
  } catch (error) {
    return null;
  }
}
