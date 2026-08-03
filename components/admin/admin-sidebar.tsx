"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CircleDollarSign, 
  Upload, 
  MessageSquare, 
  Bell, 
  BarChart2, 
  Users, 
  Settings, 
  Lock,
  BookOpen,
  FileText,
  List,
  ShieldCheck,
  CreditCard,
  Database,
  FileQuestion
} from "lucide-react";
import { cn } from "@/lib/utils";
import useSession from "@/stores/session";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toaster";

const dashboardLinks = [
  { name: "Revenue", href: "/admin/revenue", icon: CircleDollarSign },
  { name: "Student Performance", href: "/admin/performance", icon: BarChart2 },
  { name: "Discussion Forum", href: "/admin/discussions", icon: MessageSquare, badge: 12 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
];

const masterLinks = [
  { name: "Subjects", href: "/admin/subjects", icon: BookOpen },
  { name: "Chapters", href: "/admin/chapters", icon: FileText },
  { name: "Topics", href: "/admin/topics", icon: List },
];

const managementLinks = [
  { name: "All Students", href: "/admin/users", icon: Users },
  { name: "Plans", href: "/admin/plans", icon: CreditCard },
  { name: "Approvals", href: "/admin/approvals", icon: ShieldCheck },
];

const studyMaterialLinks = [
  { name: "Upload Center", href: "/admin/upload", icon: Upload },
  { name: "Questions Bank", href: "/admin/questions", icon: Database },
  { name: "Test Series", href: "/admin/tests", icon: FileQuestion },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, setSession } = useSession();

  async function onLogout() {
    const toastId = toast.loading("Logging out...");
    // Simulate logout delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return toastId;
  }

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: onLogout,
    onSuccess: (toastId) => {
      toast.success("Logged out successfully!", { id: toastId });
      setSession(null);
      router.replace("/auth/login");
    },
    onError: (_error, _variables, context: any) => {
      toast.error("Internal server error!", { id: context });
    },
  });

  return (
    <aside className="w-[280px] h-screen flex flex-col bg-[#0B132B] text-slate-300 shadow-xl overflow-y-auto shrink-0 scrollbar-hide border-r border-slate-800/50">
      {/* Logo Section */}
      <div className="pt-8 pb-6 px-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-[#F5A623]">Apex</span> <span className="text-white">JEE</span>
        </h1>
      </div>

      {/* User Profile */}
      <div className="px-8 pb-8 flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-slate-700/50 shadow-inner">
            <AvatarImage src={(session as any)?.profileImage} />
            <AvatarFallback className="bg-[#2A3756] text-white font-semibold text-lg">
              {session?.name ? session.name.charAt(0).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00E676] border-[2.5px] border-[#0B132B] rounded-full"></span>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <p className="text-white font-medium text-[14px]">{session?.name || 'Admin'}</p>
            <span className="text-[#00E676] text-[9px] uppercase font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] block"></span> Live
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">Platform Administrator</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-5 space-y-8">
        {/* Dashboard */}
        <div>
          <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Dashboard
          </h2>
          <nav className="space-y-1">
            {dashboardLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-[#1E293B] text-[#F5A623] border border-slate-700/50 shadow-sm" 
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={cn(isActive ? "text-[#F5A623]" : "text-slate-400 group-hover:text-white transition-colors")} />
                    <span className="text-[13px] font-medium">{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-[#FF3366] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Study Material */}
        <div>
          <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Study Material
          </h2>
          <nav className="space-y-1">
            {studyMaterialLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-[#1E293B] text-[#F5A623] border border-slate-700/50 shadow-sm" 
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={cn(isActive ? "text-[#F5A623]" : "text-slate-400 group-hover:text-white transition-colors")} />
                    <span className="text-[13px] font-medium">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Master Data / Taxonomy */}
        <div>
          <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Academic Taxonomy
          </h2>
          <nav className="relative space-y-1 ml-2">
            {/* Vertical taxonomy line */}
            <div className="absolute left-[15px] top-[20px] bottom-[20px] w-px bg-slate-700/60"></div>
            
            {masterLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative flex items-center py-2.5 rounded-xl transition-all duration-200 group pl-10 pr-3",
                    isActive 
                      ? "bg-[#1E293B] text-[#F5A623] border border-slate-700/50 shadow-sm" 
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {/* Horizontal connecting line */}
                  <div className={cn(
                    "absolute left-[15px] top-1/2 -translate-y-1/2 w-4 h-px transition-colors",
                    isActive ? "bg-[#F5A623]" : "bg-slate-700/60 group-hover:bg-slate-500"
                  )}></div>
                  
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={cn(isActive ? "text-[#F5A623]" : "text-slate-400 group-hover:text-white transition-colors")} />
                    <span className="text-[13px] font-medium">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Management */}
        <div>
          <h2 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
            Management
          </h2>
          <nav className="space-y-1">
            {managementLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-[#1E293B] text-[#F5A623] border border-slate-700/50 shadow-sm" 
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={cn(isActive ? "text-[#F5A623]" : "text-slate-400 group-hover:text-white transition-colors")} />
                    <span className="text-[13px] font-medium">{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="px-5 pb-6 pt-4 space-y-6">
        {/* Days to Exam Card */}
        <div className="mx-2 p-4 rounded-xl border border-slate-700/60 bg-[#0F172A]/50 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#F5A623]/5 rounded-bl-full blur-xl"></div>
          <h3 className="text-[#F5A623] text-[34px] leading-none font-bold tracking-tight">127</h3>
          <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mt-2 mb-1.5">Days to Exam</p>
          <p className="text-white text-[11px] font-medium tracking-wide">JEE Advanced 2026</p>
        </div>

        {/* Action Links */}
        <div className="px-3 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings size={16} />
            <span className="text-[13px] font-medium">Settings</span>
          </Link>
          <button
            onClick={() => handleLogout()}
            disabled={isPending}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#FF4D4D] hover:bg-[#FF4D4D]/10 transition-all disabled:opacity-50"
          >
            <Lock size={16} />
            <span className="text-[13px] font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
