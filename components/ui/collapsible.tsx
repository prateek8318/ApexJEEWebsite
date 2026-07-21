"use client";
import { cn } from "@lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent> & {
  ref?: Ref<ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>>;
}) => (
  <CollapsiblePrimitive.CollapsibleContent
    className={cn(
      "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden",
      className,
    )}
    ref={ref}
    {...props}
  />
);
CollapsibleContent.displayName =
  CollapsiblePrimitive.CollapsibleContent.displayName;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
