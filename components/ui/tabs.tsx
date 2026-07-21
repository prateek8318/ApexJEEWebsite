"use client";
import { cn } from "@lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  MouseEvent,
  Ref,
  useRef,
  useState,
} from "react";

const Tabs = TabsPrimitive.Root;

const TabsList = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  ref?: Ref<ComponentRef<typeof TabsPrimitive.List>>;
}) => {
  const [drag, setDrag] = useState<boolean>(false);
  const tabListRef = useRef<HTMLDivElement | null>(null);

  const onRefMerge = (instance: HTMLDivElement | null) => {
    if (tabListRef) {
      tabListRef.current = instance;
    }
    if (ref) {
      if (typeof ref === "function") {
        ref(instance);
      } else if (typeof ref === "object") {
        ref.current = instance;
      }
    }
  };

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (tabListRef.current) {
      tabListRef.current.classList.add("cursor-grab");
      setDrag(true);
    }
  };

  const onMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (tabListRef.current) {
      tabListRef.current.classList.remove("cursor-grab");
      setDrag(false);
    }
  };

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (tabListRef.current && drag) {
      tabListRef.current.scrollLeft -= e.movementX;
    }
  };

  const onMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (tabListRef.current) {
      tabListRef.current.classList.remove("cursor-grab");
      setDrag(false);
    }
  };

  return (
    <TabsPrimitive.List
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-12 w-full items-center overflow-x-auto rounded-xl p-1 lg:max-w-0 lg:min-w-full",
        className,
      )}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      ref={onRefMerge}
      {...props}
    />
  );
};
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: Ref<ComponentRef<typeof TabsPrimitive.Trigger>>;
}) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-xs",
      className,
    )}
    {...props}
  />
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & {
  ref?: Ref<ComponentRef<typeof TabsPrimitive.Content>>;
}) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus-visible:outline-hidden", className)}
    {...props}
  />
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
