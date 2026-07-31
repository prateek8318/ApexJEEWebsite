"use client";

import { useState, useEffect } from "react";
import { Bell, Settings, HelpCircle, Menu, UserRound } from "lucide-react";
import Image from "next/image";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import Link from "next/link";
// import SidebarSheet from "./sidebar-sheet";
import useSession from "@stores/session";

import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@components/ui/toaster";
import { usePathname, useRouter } from "next/navigation";
import { logo } from "@assets";

type HeaderProps = {
  menuItemsData?: MenuItem[];
  sidebarVisible?: boolean;
  logoVisible?: boolean;
};

const Header = ({
  // menuItemsData = [],
  sidebarVisible = true,
  logoVisible = true,
}: HeaderProps) => {
  const { session, setSession } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [openSidebarSheet, setOpenSidebarSheet] = useState<boolean>(false);
  const [onLogoutToast, setOnLogoutToast] = useState<string | number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onLogout() {
    setOnLogoutToast(
      toast.loading("Loading...", { description: "Logging out..." }),
    );
    // Since JWT is stateless and there is no backend logout route,
    // we just resolve immediately to clear local session.
    return Promise.resolve();
  }

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: onLogout,
    onSuccess: () => {
      toast.success("Success!", {
        id: onLogoutToast,
        description: "Logged out successfully!",
      });
      setSession(null);
      router.replace("/auth/login");
    },
    onError: (error: unknown) => {
      let errorMsg = "Internal server error!";
      const responseData = (error as AxiosError)?.response?.data;
      if (typeof responseData === "string" && !responseData.includes("<html")) {
        errorMsg = responseData;
      } else if (typeof responseData === "object" && (responseData as any)?.message) {
        errorMsg = (responseData as any).message;
      }

      toast.error("Error!", {
        id: onLogoutToast,
        description: errorMsg,
      });
    },
  });

  // const getMenuItems = async () => {
  //   try {
  //     const response = await axios.get("/api/menu-item");
  //     return response?.data as MenuItem[];
  //   } catch (error: unknown) {
  //     console.info(
  //       ((error as AxiosError)?.response?.data as string) ||
  //         "Internal server error!",
  //     );
  //     return [];
  //   }
  // };
  // const { data: menuItems } = useQuery<MenuItem[]>({
  //   queryKey: ["menu-items"],
  //   queryFn: getMenuItems,
  //   initialData: menuItemsData,
  //   retry: 0,
  //   enabled: !!session,
  //   refetchInterval: 5000,
  // });

  return (
    <>
      {/* {sidebarVisible && <SidebarSheet openSheet={openSidebarSheet} setOpenSheet={setOpenSidebarSheet} menuItems={menuItems} />} */}

      <header className="sticky top-0 z-40 flex h-16 shrink-0 w-full items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
        <div className="flex items-center justify-center">
          {sidebarVisible && (
            <Button
              className="lg:hidden"
              onClick={() => setOpenSidebarSheet(!openSidebarSheet)}
              size="icon"
              variant="ghost"
            >
              <Menu />
            </Button>
          )}
          {logoVisible && (
            <Button asChild className="p-0" size="default" variant="ghost">
              <Link href="/">
                <Image alt="Logo" height={40} priority src={logo} />
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!pathname?.startsWith("/admin") && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary hover:bg-accent"
            >
              <Link href="/notifications">
                {" "}
                <Bell className="h-5 w-5" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-accent"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          <div className="h-8 w-px bg-border mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full border-2 border-border p-0 hover:border-primary/50"
              >
                <Avatar className="h-full w-full border-none">
                  <AvatarImage src={session?.avatarUrl || (session as any)?.profileImage} />
                  <AvatarFallback className="bg-primary text-accent flex items-center justify-center">
                    <UserRound className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 p-1">
                  <p className="text-sm font-semibold leading-none text-foreground">
                    {mounted ? (session?.name || "Admin") : "Admin"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {mounted ? session?.email : ""}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={pathname?.startsWith("/admin") ? "/admin/settings" : "/settings"}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={pathname?.startsWith("/admin") ? "/admin/profile" : "/profile"}>
                  <UserRound className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLoggingOut}
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive-soft"
                onClick={() => logout()}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
};
export default Header;
