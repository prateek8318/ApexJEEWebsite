"use client";
import { cn } from "@lib/utils";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const Avatar = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  ref?: Ref<ComponentRef<typeof AvatarPrimitive.Root>>;
}) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex size-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
  ref?: Ref<ComponentRef<typeof AvatarPrimitive.Image>>;
}) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square size-full", className)}
    {...props}
  />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
  ref?: Ref<ComponentRef<typeof AvatarPrimitive.Fallback>>;
}) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "bg-muted flex size-full items-center justify-center rounded-full",
      className,
    )}
    {...props}
  />
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
