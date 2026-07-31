"use client";
import { z } from "zod";
import { useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetPasswordSchema } from "@schemas/resetPassword";
import { Input } from "@components/ui/input";
import { userAuthApi } from "@lib/api/user/auth";
import { Button } from "@components/ui/button";
import { toast } from "@components/ui/toaster";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import usePasswordToggle from "@hooks/usePasswordToggle";
import { LockKeyhole, RefreshCcwDot } from "lucide-react";

type ResetPasswordFormProps = {
  email: string;
  otp: string;
};

const ResetPasswordForm = ({ email, otp: _otp }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [onResetToast, setOnResetToast] = useState<string | number>();
  const { inputIcon: pwdIcon, inputType: pwdType } = usePasswordToggle();
  const { inputIcon: confirmPwdIcon, inputType: confirmPwdType } =
    usePasswordToggle();

  const defaultValues: z.infer<typeof ResetPasswordSchema> = {
    newPassword: "",
    confirmPassword: "",
  };

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    defaultValues: defaultValues,
    mode: "onTouched",
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onReset = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setOnResetToast(
      toast.loading("Loading...", { description: "Resetting password..." }),
    );
    await userAuthApi.resetPassword({ identifier: email, password: values?.newPassword });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onReset,
    onSuccess: () => {
      toast.success("Success!", {
        id: onResetToast,
        description: "Password reset successfully!",
      });
      router.replace("/auth/login");
    },
    onError: (error: unknown) => {
      toast.error("Error!", {
        id: onResetToast,
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
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2 flex items-center justify-between">
                <FormLabel className="text-sm font-medium">
                  New Password
                </FormLabel>

                <span className="text-[10px] font-semibold uppercase text-amber-500">
                  Weak
                </span>
              </div>

              <FormControl>
                <Input
                  {...field}
                  type={pwdType}
                  placeholder="Enter new password"
                  startContent={<LockKeyhole size={16} />}
                  endContent={pwdIcon}
                  className="h-11"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Confirm New Password
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  type={confirmPwdType}
                  placeholder="Confirm password"
                  startContent={<LockKeyhole size={16} />}
                  endContent={confirmPwdIcon}
                  className="h-11"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="h-11 w-full bg-slate-900 text-white hover:bg-slate-800"
        >
          {isPending ? "Setting Password..." : "Set New Password"}
          <RefreshCcwDot className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
