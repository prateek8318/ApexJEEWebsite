"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@lib/utils";
import { useState } from "react";
import { icon } from "@assets";
import mainLogo from "@/assets/images/logo.png";
import { Button } from "@components/ui/button";
import { ChevronLeft, LogOut, User } from "lucide-react";
import { ScrollArea } from "@components/ui/scroll-area";
import CollapsibleMenuItem from "./collapsible-menu-item";
import MenuItemComponent from "./menu-item";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";

import useSession from "@stores/session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@components/ui/toaster";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";

type SidebarProps = {
  menuItemsData?: MenuItem[];
};

const Sidebar = ({ menuItemsData }: SidebarProps) => {

  const router = useRouter();
  const { session, setSession } = useSession();
  const [sidebarIsOpen, setSidebarIsOpen] = useState<boolean>(true);
  const [onLogoutToast, setOnLogoutToast] = useState<string | number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function onLogout() {
    setOnLogoutToast(
      toast.loading("Loading...", { description: "Logging out..." }),
    );
    await fetch("/api/auth/logout", { method: "POST" });
  }

  const { mutate, isPending } = useMutation({
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
      toast.error("Error!", {
        id: onLogoutToast,
        description: "Internal server error!",
      });
    },
  });


  return (
    <aside
      className={cn(
        "bg-[#0F172A] sticky inset-y-0 left-0 z-30 hidden h-screen shrink-0 -translate-x-full py-5 transition-[width] duration-300 ease-in-out lg:flex lg:translate-x-0 lg:flex-col lg:items-center lg:justify-start shadow-sm",
        sidebarIsOpen ? "w-72 px-5" : "w-20 px-2",
      )}
    >
      <Button
        className="bg-accent absolute top-4 -right-4 hidden size-8 lg:flex"
        onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        size="icon"
        variant="ghost"
      >
        <ChevronLeft
          className={cn(
            "transition-transform duration-300 ease-in-out",
            sidebarIsOpen ? "rotate-0" : "rotate-180",
          )}
          size={16}
        />
      </Button>
      <Button
        className="transition-transform duration-300 ease-in-out hover:bg-transparent"
        size={sidebarIsOpen ? "default" : "icon"}
        variant="ghost"
        asChild
      >
        <Link href="/">
          {sidebarIsOpen ? (
            <div className="flex items-center mt-6 mr-14">
              <Image 
                alt="Apex JEE Logo" 
                height={32} 
                priority 
                src={mainLogo} 
                className="object-contain"
              />
            </div>
          ) : (
            <Image alt="Logo" height={40} priority src={icon} width={40} />
          )}
        </Link>
      </Button>
      <ScrollArea className="mt-8 flex w-full flex-col items-center justify-center gap-2">
        <ul className="flex w-full flex-col items-center justify-center gap-1 p-1">
          {(menuItemsData)?.map((item: MenuItem) => (
            <li
              className="flex w-full items-center justify-center gap-1"
              key={item?.uuid}
            >
              {item?.subMenus?.length ? (
                <CollapsibleMenuItem
                  menuItem={item}
                  sidebarIsOpen={sidebarIsOpen}
                />
              ) : (
                <MenuItemComponent menuItem={item} sidebarIsOpen={sidebarIsOpen} />
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out mt-auto bg-[#1E293B] rounded-xl flex items-center justify-between py-2 px-3 w-full border border-slate-700 shadow-sm",
          !sidebarIsOpen && "p-2 justify-center",
        )}
      >
        {sidebarIsOpen && (
          <div className="flex items-center gap-2 overflow-hidden">
            <Avatar className="h-8 w-8 border-none shrink-0">
              <AvatarImage src={session?.avatarUrl || (session as any)?.profileImage} />
              <AvatarFallback className="bg-blue-600 text-white flex items-center justify-center">
                <User size={16} />
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                "text-slate-200 font-bold text-sm transition-all duration-300 ease-in-out truncate",
                sidebarIsOpen ? "opacity-100 translate-x-0" : "opacity-0 invisible -translate-x-10 w-0",
              )}
            >
              {mounted ? (session?.name || "Admin") : "Admin"}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {sidebarIsOpen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="hover:bg-slate-800 hover:text-red-400 text-red-400 p-2 h-9 w-9 rounded-xl transition-colors"
                    disabled={isPending}
                    onClick={() => mutate()}
                    variant="ghost"
                  >
                    <LogOut size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
