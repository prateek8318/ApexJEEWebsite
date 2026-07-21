"use client";
import { cn } from "@lib/utils";
import { Check } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const Checkbox = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  ref?: Ref<ComponentRef<typeof CheckboxPrimitive.Root>>;
}) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-ring size-4 shrink-0 rounded-sm border focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check size={16} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
