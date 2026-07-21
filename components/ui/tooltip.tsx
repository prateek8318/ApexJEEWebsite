"use client";
import { cn } from "@lib/utils";
import { ComponentProps } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

const TooltipProvider = ({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
};

TooltipProvider.displayName = TooltipPrimitive.Provider.displayName;

const Tooltip = ({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Root>) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
};

Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipTrigger = ({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
};

TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipPortal = ({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Portal>) => {
  return <TooltipPrimitive.Portal data-slot="tooltip-portal" {...props} />;
};

TooltipPortal.displayName = TooltipPrimitive.Portal.displayName;

const TooltipArrow = ({
  className,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Arrow>) => {
  return (
    <TooltipPrimitive.Arrow
      className={cn(
        "bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]",
        className,
      )}
      data-slot="tooltip-arrow"
      {...props}
    />
  );
};

TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

const TooltipContent = ({
  className,
  sideOffset = 0,
  children,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) => {
  return (
    <TooltipPortal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipArrow />
      </TooltipPrimitive.Content>
    </TooltipPortal>
  );
};

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
