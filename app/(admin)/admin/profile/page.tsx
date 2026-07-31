"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/admin/auth";
import { AdminPageHeader } from "@/components/admin/ui/admin-page-header";
import { UserRound, Mail, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => authApi.getProfile(),
  });

  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[200px] w-full flex items-center justify-center">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full px-4 sm:px-6 lg:px-8 py-6">
      <AdminPageHeader 
        title="Admin Profile"
        description="View your account details and profile information."
        buttonText="Edit Profile"
        onAdd={() => alert("Edit profile coming soon!")}
        icon={<UserRound />}
        colorTheme="indigo"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-slate-200 shadow-sm">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <Avatar className="h-32 w-32 border-4 border-white shadow-lg mb-6">
              <AvatarImage src={profile?.profileImage} />
              <AvatarFallback className="bg-indigo-600 text-white text-4xl font-bold">
                {profile?.email?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Administrator
            </h2>
            <p className="text-slate-500 mb-4">{profile?.email}</p>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              Active Account
            </Badge>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-slate-200 shadow-sm">
          <CardContent className="p-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">
              Account Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Email Address</p>
                  <p className="text-base font-semibold text-slate-900">{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-50 p-3 rounded-xl">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Member Since</p>
                  <p className="text-base font-semibold text-slate-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
