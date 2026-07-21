"use client";
import { cn } from "@lib/utils";
import { ChevronDown } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ComponentPropsWithoutRef, ComponentRef, Ref } from "react";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> & {
  ref?: Ref<ComponentRef<typeof AccordionPrimitive.Item>>;
}) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
);
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = ({
  ref,
  className,
  children,
  direction = "right",
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
  direction?: "right" | "left";
  ref?: Ref<ComponentRef<typeof AccordionPrimitive.Trigger>>;
}) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between gap-2 py-4 font-medium transition-all [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {direction === "right" ? (
        <>
          {children}
          <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
        </>
      ) : (
        <>
          <ChevronDown className="size-4 shrink-0 transition-transform duration-200" />
          {children}
        </>
      )}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = ({
  ref,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  ref?: Ref<ComponentRef<typeof AccordionPrimitive.Content>>;
}) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm transition-all"
    {...props}
  >
    <div className={cn("pt-0 pb-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
);

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
