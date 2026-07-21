"use client";
import { cn } from "@lib/utils";
import { ComponentProps } from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

const toggleVariants = cva(
  "flex items-center justify-center gap-1 shrink-0 rounded-xl text-sm font-medium disabled:pointer-events-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-offset-2 outline-none transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-transparent hover:bg-primary/80 hover:text-primary-foreground/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        success:
          "bg-transparent hover:bg-success/80 hover:text-success-foreground/80 data-[state=on]:bg-success data-[state=on]:text-success-foreground",
        warning:
          "bg-transparent hover:bg-warning/80 hover:text-warning-foreground/80 data-[state=on]:bg-warning data-[state=on]:text-warning-foreground",
        destructive:
          "bg-transparent hover:bg-destructive/80 hover:text-destructive-foreground/80 data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground",
        outline:
          "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-transparent hover:bg-secondary/80 hover:text-secondary-foreground/80 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground",
        ghost:
          "bg-transparent hover:bg-accent/80 hover:text-accent-foreground/80 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-2",
        lg: "h-12 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Toggle = ({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) => {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
};
Toggle.displayName = "Toggle";

export { Toggle, toggleVariants };
