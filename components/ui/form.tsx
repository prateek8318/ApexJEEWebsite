import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "@components/ui/label";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  HTMLAttributes,
  Ref,
  createContext,
  use,
  useId,
} from "react";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext>
  );
};

const useFormField = () => {
  const fieldContext = use(FormFieldContext);
  const itemContext = use(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

const FormItem = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
}) => {
  const id = useId();

  return (
    <FormItemContext value={{ id }}>
      <div ref={ref} className={className} {...props} />
    </FormItemContext>
  );
};
FormItem.displayName = "FormItem";

const FormLabel = ({
  ref,
  className,
  ...props
}: ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  ref?: Ref<ComponentRef<typeof LabelPrimitive.Root>>;
}) => {
  const { formItemId } = useFormField();

  return (
    <Label ref={ref} className={className} htmlFor={formItemId} {...props} />
  );
};
FormLabel.displayName = "FormLabel";

const FormControl = ({
  ref,
  ...props
}: ComponentPropsWithoutRef<typeof Slot> & {
  ref?: Ref<ComponentRef<typeof Slot>>;
}) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
};
FormControl.displayName = "FormControl";

const FormDescription = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  ref?: Ref<HTMLParagraphElement>;
}) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
};
FormDescription.displayName = "FormDescription";

const FormMessage = ({
  ref,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & {
  ref?: Ref<HTMLParagraphElement>;
}) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-destructive text-xs font-medium", className)}
      {...props}
    >
      {body}
    </p>
  );
};
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
