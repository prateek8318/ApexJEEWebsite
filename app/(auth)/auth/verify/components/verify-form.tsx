"use client";

import { z } from "zod";
import { useState } from "react";

import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { userAuthApi } from "@lib/api/user/auth";
import { authApi } from "@lib/api/admin/auth";
import useCounter from "@hooks/useCounter";
import { toast } from "@components/ui/toaster";
import { Button } from "@components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { RefreshCcw, ShieldCheck } from "lucide-react";
import { VerificationSchema } from "@schemas/verification";

type VerifyFormProps = {
  email: string;
  type: string;
};

const VerifyForm = ({ email, type }: VerifyFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // setSession removed
  const { counter, startCounter } = useCounter(59);

  const callbackUrl = searchParams.get("callbackUrl");
  // @ts-ignore
  const _callbackUrl = callbackUrl;

  const [onResendToast, setOnResendToast] = useState<string | number>();
  const [onVerifyToast, setOnVerifyToast] = useState<string | number>();

  const form = useForm<z.infer<typeof VerificationSchema>>({
    resolver: zodResolver(VerificationSchema),
    mode: "onTouched",
    defaultValues: {
      otp: "",
    },
  });

  const onResend = async () => {
    setOnResendToast(
      toast.loading("Loading...", { description: "Resending OTP..." }),
    );
    if (type === "admin") {
      await authApi.resendOtp({ identifier: email });
    } else {
      await userAuthApi.resendOtp({ identifier: email });
    }
  };

  const { mutate: resendMutate, isPending: resendIsPending } = useMutation({
    mutationFn: onResend,
    onSuccess: () => {
      startCounter(59);
      toast.success("Success!", {
        id: onResendToast,
        description: "OTP sent successfully!",
      });
    },
    onError: (error: unknown) => {
      toast.error("Error!", {
        id: onResendToast,
        description:
          (typeof (error as AxiosError)?.response?.data === "string"
            ? (error as AxiosError).response?.data as string
            : ((error as AxiosError)?.response?.data as any)?.message) ||
          "Internal server error!",
      });
    },
  });

  const onVerify = async (values: z.infer<typeof VerificationSchema>) => {
    setOnVerifyToast(
      toast.loading("Loading...", { description: "Verifying OTP..." }),
    );
    const { otp } = values;
    if (type === "admin") {
      const response = await authApi.verifyOtp({ identifier: email, otp });
      return response;
    } else {
      const response = await userAuthApi.verifyOtp({
        identifier: email,
        otp,
      });
      if (type === "VERIFICATION") {
        return response.data;
      } else {
        return values;
      }
    }
  };
  const { mutate: verifyMutate, isPending: verifyIsPending } = useMutation({
    mutationFn: onVerify,
    onSuccess: (values: any) => {
      if (type === "admin") {
        toast.success("Success!", {
          id: onVerifyToast,
          description: values.message || "OTP verified successfully. Your account is pending super admin approval.",
        });
        router.replace("/auth/login?tab=admin");
      } else if (type === "VERIFICATION") {
        toast.success("Success!", {
          id: onVerifyToast,
          description: "Account verified successfully! Please log in.",
        });
        router.replace("/auth/login");
      } else {
        const { otp } = values as z.infer<typeof VerificationSchema>;
        toast.success("Success!", {
          id: onVerifyToast,
          description: "OTP verified successfully!",
        });
        router.replace(
          `/auth/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`,
        );
      }
    },
    onError: (error: unknown) => {
      toast.error("Error!", {
        id: onVerifyToast,
        description:
          (typeof (error as AxiosError)?.response?.data === "string"
            ? (error as AxiosError).response?.data as string
            : ((error as AxiosError)?.response?.data as any)?.message) ||
          "Internal server error!",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col items-center justify-stretch gap-7"
        onSubmit={form.handleSubmit((values) => verifyMutate(values))}
      >
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  One-Time Password
                  <span className="text-destructive">*</span>
                </FormLabel>

                <FormControl>
                  <InputOTP className="w-full" maxLength={6} {...field}>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPGroup key={index}>
                        <InputOTPSlot index={index} />
                      </InputOTPGroup>
                    ))}
                  </InputOTP>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <Button
            type="submit"
            size="lg"
            variant="default"
            className="w-36 justify-between"
            disabled={resendIsPending || verifyIsPending}
          >
            Verify
            <ShieldCheck size={16} />
          </Button>

          {counter > 0 ? (
            <p className="flex h-12 w-full items-center justify-center">
              Resend OTP in {counter} seconds
            </p>
          ) : (
            <Button
              type="button"
              size="lg"
              variant="ghost"
              className="w-36"
              disabled={resendIsPending || verifyIsPending}
              onClick={() => resendMutate()}
            >
              <RefreshCcw size={16} />
              Resend OTP
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default VerifyForm;
