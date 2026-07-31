"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@lib/utils";
import { useState, useEffect } from "react";
import { 
  BarChart2, 
  Library, 
  MonitorPlay, 
  Pencil, 
  Bookmark, 
  ClipboardCheck, 
  Calendar, 
  TrendingUp, 
  CreditCard, 
  MessageSquare, 
  Megaphone, 
  Settings, 
  Lock 
} from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import useSession from "@stores/session";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@components/ui/toaster";

const menuGroups = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", src: "/dashboard", icon: <BarChart2 size={16} /> },
      { name: "Study Material", src: "/study-materials", icon: <Library size={16} /> },
      { name: "Video Lectures", src: "/video-lectures", icon: <MonitorPlay size={16} /> },
      { name: "Practice Questions", src: "/practice-questions", icon: <Pencil size={16} /> },
      { name: "Revision Notes", src: "/revision-notes", icon: <Bookmark size={16} /> },
      { name: "Mock Tests", src: "/mock-tests", icon: <ClipboardCheck size={16} />, badge: 2 },
      { name: "My Timetable", src: "/timetable", icon: <Calendar size={16} /> },
    ]
  },
  {
    title: "PROGRESS",
    items: [
      { name: "My Performance", src: "/performance", icon: <TrendingUp size={16} /> },
      { name: "Subscription & Billing", src: "/subscription-billing", icon: <CreditCard size={16} /> },
    ]
  },
  {
    title: "COMMUNITY",
    items: [
      { name: "Doubt Forum", src: "/doubt-form", icon: <MessageSquare size={16} />, badge: 3 },
      { name: "Notice Board", src: "/notice-board", icon: <Megaphone size={16} /> },
    ]
  }
];

export default function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { session, setSession } = useSession();
  const [mounted, setMounted] = useState(false);
  const [onLogoutToast, setOnLogoutToast] = useState<string | number>();

  useEffect(() => setMounted(true), []);

  async function onLogout() {
    setOnLogoutToast(
      toast.loading("Loading...", { description: "Logging out..." }),
    );
    // JWT is stateless, local logout only
    return Promise.resolve();
  }

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: onLogout,
    onSuccess: () => {
      toast.success("Success!", {
        id: onLogoutToast,
        description: "Logged out successfully!",
      });
      router.replace("/auth/login");
      setSession(null);
    },
    onError: () => {
      toast.error("Error!", { id: onLogoutToast, description: "Logout failed." });
    },
  });

  return (
    <aside className="bg-[#0B132B] sticky inset-y-0 left-0 z-30 hidden h-screen w-[280px] shrink-0 flex-col py-6 px-5 transition-all duration-300 ease-in-out lg:flex shadow-xl border-r border-slate-800/50">
      
      {/* Logo */}
      <Link href="/" className="mb-6 px-2 flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-[#F5A623]">Apex</span>
          <span className="text-white ml-1.5">JEE</span>
        </h1>
      </Link>

      {/* User Card */}
      <div className="bg-[#161D32] rounded-xl p-3 mb-6 flex items-center gap-3 border border-white/5 shadow-inner">
        <Avatar className="h-10 w-10 border-none shrink-0 rounded-full shadow-md bg-blue-600">
          <AvatarImage src={session?.avatarUrl || (session as any)?.profileImage} />
          <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
            {mounted ? (session?.name?.charAt(0).toUpperCase() || session?.email?.charAt(0).toUpperCase() || "S") : "S"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-white font-semibold text-sm truncate">
            {mounted ? (session?.name || "Student") : "Student"}
          </span>
          <span className="text-[#F5A623] text-xs font-semibold tracking-wide flex items-center gap-1 mt-0.5">
            ✦ Premium Plan
          </span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 w-full -mx-3 px-3">
        <div className="flex flex-col gap-6 pb-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.src);
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.src}
                        className={cn(
                          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden group",
                          isActive 
                            ? "bg-[#1E293B] text-white" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F5A623] rounded-r-md" />
                        )}
                        <div className="flex items-center gap-3 relative z-10">
                          <span className={cn(
                            "flex items-center justify-center transition-colors",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                          )}>
                            {item.icon}
                          </span>
                          {item.name}
                        </div>
                        {item.badge && (
                          <span className="bg-[#EF4444] text-white text-[11px] font-bold h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full shadow-sm z-10 relative">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Exam Countdown Widget */}
      <div className="mt-4 mb-6 bg-[#121A2F] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        <span className="text-[#F5A623] text-3xl font-black tabular-nums leading-none mb-1">127</span>
        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1.5">Days to Exam</span>
        <span className="text-white text-xs font-medium">JEE Advanced 2026</span>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col gap-1 mt-auto border-t border-white/5 pt-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-200"
        >
          <Settings size={16} />
          Settings
        </Link>
        <Button
          variant="ghost"
          onClick={() => logout()}
          disabled={isLoggingOut}
          className="flex items-center justify-start gap-3 px-3 py-2 h-auto rounded-lg text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full"
        >
          <Lock size={16} />
          Logout
        </Button>
      </div>

    </aside>
  );
}
