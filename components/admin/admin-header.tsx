"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, UserRound, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import useSession from "@/stores/session";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const routeConfig: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": { title: "Dashboard", description: "Overview of your platform" },
  "/admin/revenue": { title: "Revenue Dashboard", description: "Monitor earnings & subscriptions" },
  "/admin/performance": { title: "Student Performance", description: "Monitor analytics and test scores" },
  "/admin/upload": { title: "Upload Center", description: "Manage study materials" },
  "/admin/notifications": { title: "Notifications", description: "System alerts and announcements" },
  "/admin/discussions": { title: "Discussion Forum", description: "Community interactions" },
  "/admin/subjects": { title: "Subjects", description: "Manage platform subjects" },
  "/admin/chapters": { title: "Chapters", description: "Manage chapter structures" },
  "/admin/topics": { title: "Topics", description: "Manage topics within chapters" },
  "/admin/users": { title: "All Students", description: "Manage platform students" },
  "/admin/plans": { title: "Subscription Plans", description: "Manage pricing and plans" },
  "/admin/approvals": { title: "Approvals", description: "Pending teacher/content requests" },
  "/admin/questions": { title: "Questions Bank", description: "Manage test questions" },
  "/admin/tests": { title: "Test Series", description: "Manage mock tests" },
  "/admin/videos": { title: "Videos", description: "Manage video content" },
  "/admin/notes": { title: "Revision Notes", description: "Manage theory notes" },
  "/admin/profile": { title: "Admin Profile", description: "Manage your account" },
  "/admin/settings": { title: "Settings", description: "Platform configurations" },
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, setSession } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const toastId = toast.loading("Logging out...");
      // Simulate logout delay since JWT is stateless and there's no backend route
      await new Promise((resolve) => setTimeout(resolve, 800));
      return toastId;
    },
    onSuccess: (toastId) => {
      toast.success("Logged out successfully", { id: toastId });
      setSession(null);
      router.replace("/auth/login");
    },
    onError: (_error: any, _variables: any, context: any) => {
      toast.error("Failed to logout", { id: context });
    },
  });

  // Determine current route info
  let currentRoute = { title: "Admin Panel", description: "Manage your platform" };
  if (pathname) {
    // Find matching route or fallback to generic
    const matchedPath = Object.keys(routeConfig).find(path => pathname.startsWith(path));
    if (matchedPath) {
      currentRoute = routeConfig[matchedPath];
    }
  }

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between w-full shrink-0 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{currentRoute.title}</h1>
        <p className="text-slate-500 text-xs mt-0.5">{currentRoute.description}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
          <Bell size={16} />
        </button>
        
        <div className="h-6 w-px bg-slate-200 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full border border-slate-200 p-0 hover:border-slate-300 transition-colors"
            >
              <Avatar className="h-full w-full border-none">
                <AvatarImage src={(session as any)?.profileImage} />
                <AvatarFallback className="bg-[#0B132B] text-white flex items-center justify-center text-xs font-bold">
                  {mounted && session?.name ? session.name.charAt(0).toUpperCase() : <UserRound className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-semibold leading-none text-slate-800">
                  {mounted ? (session?.name || "Admin") : "Admin"}
                </p>
                <p className="text-xs leading-none text-slate-500 mt-1">
                  {mounted ? session?.email : ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4 text-slate-500" />
                <span className="text-sm">Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href="/admin/profile">
                <UserRound className="mr-2 h-4 w-4 text-slate-500" />
                <span className="text-sm">Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={isLoggingOut}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => logout(undefined)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
