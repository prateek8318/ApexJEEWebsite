"use client";
import { cn } from "@lib/utils";
import { ComponentProps } from "react";
import { cva, VariantProps } from "class-variance-authority";
import * as SwitchPrimitive from "@radix-ui/react-switch";

const switchVariants = cva(
  "peer data-[state=unchecked]:bg-input focus-visible:ring-ring border-border inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[state=checked]:bg-primary",
        secondary: "data-[state=checked]:bg-secondary",
        success: "data-[state=checked]:bg-success",
        warning: "data-[state=checked]:bg-warning",
        destructive: "data-[state=checked]:bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Switch = ({
  className,
  variant,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> &
  VariantProps<typeof switchVariants>) => {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(switchVariants({ variant }), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
};

export { Switch };
