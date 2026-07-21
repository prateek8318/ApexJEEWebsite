"use client";
import { cn } from "@lib/utils";
import { Dot } from "lucide-react";
import { OTPInput, OTPInputContext } from "input-otp";
import { ComponentPropsWithoutRef, ComponentRef, Ref, use } from "react";

const InputOTP = ({
  ref,
  className,
  containerClassName,
  ...props
}: ComponentPropsWithoutRef<typeof OTPInput> & {
  ref?: Ref<ComponentRef<typeof OTPInput>>;
}) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-disabled:opacity-50",
      containerClassName,
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<ComponentRef<"div">>;
}) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = ({
  ref,
  index,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  index: number;
  ref?: Ref<ComponentRef<"div">>;
}) => {
  const inputOTPContext = use(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      ref={ref}
      className={cn(
        "border-border bg-input xs:size-14 relative flex size-10 items-center justify-center border text-sm transition-all first:rounded-l-xl last:rounded-r-xl",
        isActive && "ring-ring ring-offset-background z-10 ring-2",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
};
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = ({
  ref,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  ref?: Ref<ComponentRef<"div">>;
}) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
);
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
