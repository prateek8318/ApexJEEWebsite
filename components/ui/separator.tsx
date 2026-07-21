"use client";
import { cn } from "@lib/utils";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const Separator = ({
  ref,
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
  ref?: Ref<ComponentRef<typeof SeparatorPrimitive.Root>>;
}) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      "bg-border shrink-0",
      orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
      className,
    )}
    {...props}
  />
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
