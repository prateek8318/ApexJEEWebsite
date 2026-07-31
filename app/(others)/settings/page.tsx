"use client";

import { useQuery } from "@tanstack/react-query";
import { userProfileApi } from "@/lib/api/user/profile";
import SettingsForm from "./components/settings-form";

export default function SettingsPage() {
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userProfileApi.getProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (error || !profileData?.data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-destructive">Failed to load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account details, target exam, and preparation timeline.
        </p>
      </div>
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <SettingsForm initialData={profileData.data} />
      </div>
    </div>
  );
}
