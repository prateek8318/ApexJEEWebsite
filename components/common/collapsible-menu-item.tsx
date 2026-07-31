"use client";
import Link from "next/link";
import { cn } from "@lib/utils";
import { useState } from "react";
import MenuIcon from "./menu-icon";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";

type CollapsibleMenuItemProps = {
  menuItem: MenuItem;
  sidebarIsOpen?: boolean;
};

const CollapsibleMenuItem = ({
  menuItem,
  sidebarIsOpen = true,
}: CollapsibleMenuItemProps) => {
  const path = usePathname();
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);

  return sidebarIsOpen ? (
    <Collapsible
      open={isCollapsibleOpen}
      onOpenChange={setIsCollapsibleOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          className={cn(
            "w-full justify-start text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-amber-400",
          )}
          size={"default"}
          variant="ghost"
        >
          <MenuIcon src={menuItem?.src} />
          <span className="w-full truncate text-left transition-transform duration-300 ease-in-out">
            {menuItem?.name}
          </span>
          <ChevronDown
            className={cn(
              "ml-auto transition-transform duration-300",
              isCollapsibleOpen ? "rotate-180" : "rotate-0",
            )}
            size={16}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-5 my-1 space-y-1">
        {menuItem?.subMenus?.map((subMenuItem: SubMenuItem) => (
          <Button
            className={cn(
              "w-full justify-start transition-all duration-200",
              path.includes(subMenuItem?.src)
                ? "bg-white/10 text-white font-semibold border-l-4 border-yellow-500 rounded-l-none hover:bg-white/15"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-amber-400",
            )}
            key={subMenuItem?.uuid}
            variant="ghost"
            asChild
          >
            <Link href={subMenuItem?.src}>
              <MenuIcon src={subMenuItem?.src} />
              <span className={cn(
                "w-full truncate transition-all duration-300 ease-in-out",
              )}>
                {subMenuItem?.name}
              </span>
            </Link>
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                className={cn(
                  "text-slate-300 hover:bg-slate-800/50 hover:text-amber-400",
                )}
                size={"icon"}
                variant={path.includes(menuItem?.src) ? "default" : "ghost"}
              >
                <MenuIcon src={menuItem?.src} />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">{menuItem?.name}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent side="right">
        <DropdownMenuLabel className="max-w-36 truncate">
          {menuItem?.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItem?.subMenus?.map((subMenuItem: SubMenuItem) => (
          <DropdownMenuItem key={subMenuItem?.uuid} asChild>
            <Link className="cursor-pointer" href={subMenuItem?.src}>
              <p className="max-w-36 truncate">{subMenuItem?.name}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-accent" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CollapsibleMenuItem;
