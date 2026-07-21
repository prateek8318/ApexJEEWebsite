import { cn } from "@lib/utils";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const Skeleton = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<ComponentRef<"div">>;
}) => {
  return (
    <div
      ref={ref}
      className={cn("bg-primary/10 animate-pulse rounded-xl", className)}
      {...props}
    />
  );
};

export { Skeleton };
