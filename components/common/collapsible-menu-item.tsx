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
            "w-full justify-start text-accent transition-all duration-200 hover:bg-accent/10 hover:text-accent",
          )}
          size={"default"}
          variant="ghost"
        >
          <MenuIcon src={menuItem?.src} />
          <span className="w-full truncate text-left text-accent transition-transform duration-300 ease-in-out">
            {menuItem?.name}
          </span>
          <ChevronDown
            className={cn(
              "ml-auto transition-transform duration-300 text-accent",
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
                ? "bg-accent text-primary font-semibold shadow-sm hover:bg-accent/90 hover:text-primary"
                : "text-accent hover:bg-accent/10 hover:text-accent",
            )}
            key={subMenuItem?.uuid}
            variant="ghost"
            asChild
          >
            <Link href={subMenuItem?.src}>
              <MenuIcon src={subMenuItem?.src} />
              <span className={cn(
                "w-full truncate transition-all duration-300 ease-in-out",
                path.includes(subMenuItem?.src) ? "text-primary" : "text-accent"
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
                  !path.includes(menuItem?.src) && "text-accent",
                  "text-accent hover:bg-accent/10 hover:text-accent",
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
