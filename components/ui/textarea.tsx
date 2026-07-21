import { cn } from "@lib/utils";
import { ReactNode, Ref, TextareaHTMLAttributes } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  endContent?: ReactNode;
  startContent?: ReactNode;
}

const Textarea = ({
  className,
  endContent,
  startContent,
  ref,
  ...props
}: TextareaProps & {
  ref?: Ref<HTMLTextAreaElement>;
}) => {
  return (
    <div
      className={cn(
        "border-border bg-input ring-offset-background has-focus:ring-ring flex h-24 w-full justify-center gap-2 rounded-xl border py-2 ps-2.5 has-focus:ring-2 has-focus:ring-offset-2 has-disabled:cursor-not-allowed has-disabled:opacity-50",
        className,
      )}
    >
      <div className="flex h-8 items-center justify-center">{startContent}</div>
      <textarea
        className="peer placeholder:text-muted-foreground flex h-full w-full resize-none self-center bg-transparent py-1.5 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
        ref={ref}
        {...props}
      />
      <div className="flex h-8 items-center justify-center">{endContent}</div>
    </div>
  );
};
Textarea.displayName = "Textarea";

export { Textarea };
