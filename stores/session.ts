"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of the authentication session (you can extend this later)
export type AuthSession = {
  userId?: string;
  token?: string;
  uuid?: string | null;
  avatarUrl?: string | null;
  name?: string | null;
  email?: string | null;
  contactNo?: string | null;
  organization?: {
    uuid?: string | null;
    logoUrl?: string | null;
    name?: string | null;
    email?: string | null;
    contactNo?: string | null;
    website?: string | null;
  } | null;
  role?: string[];
};

type AuthSessionStore = {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
};

// Create a Zustand store that persists the session across page reloads
const useSession = create<AuthSessionStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
    }),
    { name: "AuthSession" }
  )
);

export default useSession;
