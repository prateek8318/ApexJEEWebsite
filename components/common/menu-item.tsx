"use client";
import Link from "next/link";
import { cn } from "@lib/utils";
import MenuIcon from "./menu-icon";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";

type MenuItemProps = {
  menuItem: MenuItem;
  sidebarIsOpen?: boolean;
};

const MenuItem = ({ menuItem, sidebarIsOpen = true }: MenuItemProps) => {
  const path = usePathname();

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              sidebarIsOpen && "w-full justify-start transition-all duration-200",
              path.includes(menuItem?.src)
                ? "bg-white/10 text-white font-semibold border-l-4 border-yellow-500 rounded-l-none hover:bg-white/15"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-amber-400",
            )}
            size={sidebarIsOpen ? "default" : "icon"}
            variant={path.includes(menuItem?.src) ? "default" : "ghost"}
            asChild
          >
            <Link href={menuItem?.src}>
              <MenuIcon src={menuItem?.src} />
              <span
                className={cn(
                  "w-full truncate transition-all duration-300 ease-in-out",
                  sidebarIsOpen ? "opacity-100 translate-x-0" : "opacity-0 invisible -translate-x-10 w-0",
                )}
              >
                {menuItem?.name}
              </span>
            </Link>
          </Button>
        </TooltipTrigger>
        {sidebarIsOpen === false && (
          <TooltipContent side="right">{menuItem?.name}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default MenuItem;
