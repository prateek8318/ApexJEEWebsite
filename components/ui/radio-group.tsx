"use client";
import { cn } from "@lib/utils";
import { Circle } from "lucide-react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const RadioGroup = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
  ref?: Ref<ComponentRef<typeof RadioGroupPrimitive.Root>>;
}) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "border-border bg-input ring-offset-background has-focus:ring-ring flex min-h-12 flex-wrap items-center justify-center gap-2 rounded-xl border px-3 py-2 has-focus:ring-2 has-focus:ring-offset-2 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
};
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
  ref?: Ref<ComponentRef<typeof RadioGroupPrimitive.Item>>;
}) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "border-primary text-primary ring-offset-background focus-visible:ring-ring flex aspect-square size-4 items-center justify-center rounded-full border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="size-2 fill-current stroke-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
};
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
