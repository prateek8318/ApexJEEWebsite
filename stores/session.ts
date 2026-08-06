"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const STUDENT_SESSION_KEY = "AuthSession";
const ADMIN_SESSION_KEY = "AdminAuthSession";

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

const createPersistedSessionStore = (storageKey: string) =>
  create<AuthSessionStore>()(
    persist(
      (set) => ({
        session: null,
        setSession: (session) => set({ session }),
      }),
      { name: storageKey }
    )
  );

export const useStudentSession = createPersistedSessionStore(STUDENT_SESSION_KEY);
export const useAdminSession = createPersistedSessionStore(ADMIN_SESSION_KEY);

export default useStudentSession;
