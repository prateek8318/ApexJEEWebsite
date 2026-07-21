"use client";
import { cn } from "@lib/utils";
import { ComponentProps } from "react";
import { cva, VariantProps } from "class-variance-authority";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const progressVariants = cva(
  "ring-offset-background focus-visible:ring-ring flex shrink-0 cursor-pointer items-center justify-center gap-1 rounded-xl text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-success",
        warning: "bg-warning",
        destructive: "bg-destructive",
        secondary: "bg-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root> &
  VariantProps<typeof progressVariants>;

const Progress = ({ className, value, variant, ...props }: ProgressProps) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-input relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "h-full w-full flex-1 transition-all",
          progressVariants({ variant }),
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
};

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
