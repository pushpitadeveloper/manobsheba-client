"use client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;

export async function updateUser(data) {
  return await authClient.updateUser(data);
}

export async function signInWithGoogle() {
  return await signIn.social({
    provider: "google",
    callbackURL: "/",
  });
}