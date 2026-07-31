"use client";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema } from "@schemas/forgotPassword";
import { toast } from "@components/ui/toaster";
import { userAuthApi } from "@lib/api/user/auth";
import { AxiosError } from "axios";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { ArrowLeft, Mail, Send } from "lucide-react";

const recoverPasswordForm = () => {
  const router = useRouter();
  const [onSendToast, setOnSendToast] = useState<string | number>();

  const defaultValues: z.infer<typeof ForgotPasswordSchema> = {
    email: "",
  };

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    defaultValues: defaultValues,
    mode: "onTouched",
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSend = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    setOnSendToast(
      toast.loading("Loading...", { description: "Sending OTP..." })
    );
    await userAuthApi.resendOtp({ identifier: values.email });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onSend,
    onSuccess: (_: void, values: z.infer<typeof ForgotPasswordSchema>) => {
      const { email } = values;
      toast.success("Success!", {
        id: onSendToast,
        description: "OTP sent successfully!",
      });
      router.push(
        `/auth/verify?email=${encodeURIComponent(email)}&type=FORGOT_PASSWORD`,
      );
    },
    onError: (error: unknown) => {
      toast.error("Error!", {
        id: onSendToast,
        description:
          ((error as AxiosError)?.response?.data as string) ||
          "Internal server error!",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="flex h-full w-full max-w-sm flex-col items-center justify-stretch gap-7"
      >
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Email<span className="text-destructive">*</span>
                </FormLabel>

                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    startContent={<Mail size={16} />}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-3">
          <Button
            disabled={isPending}
            type="submit"
            size="lg"
            variant="default"
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-[13.5px] font-medium tracking-wide text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            Send
            <Send size={16} />
          </Button>

          <Button
            type="button"
            size="lg"
            variant="ghost"
            className="w-36"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default recoverPasswordForm;
