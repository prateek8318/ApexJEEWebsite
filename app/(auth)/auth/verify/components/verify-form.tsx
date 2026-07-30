"use client";

import { z } from "zod";
import { useState } from "react";
import axios from "@config/axios";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import useSession from "@stores/session";
import { userAuthApi } from "@lib/api/user/auth";
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
  const { setSession } = useSession();
  const { counter, startCounter } = useCounter(59);

  const callbackUrl = searchParams.get("callbackUrl");

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
    await axios.post("/api/otp/get-otp", { email });
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
          ((error as AxiosError)?.response?.data as string) ||
          "Internal server error!",
      });
    },
  });

  const onVerify = async (values: z.infer<typeof VerificationSchema>) => {
    setOnVerifyToast(
      toast.loading("Loading...", { description: "Verifying OTP..." }),
    );
    const { otp } = values;
    const response = await userAuthApi.verifyOtp({
      email,
      otp,
    });
    if (type === "VERIFICATION") {
      return response.data;
    } else {
      return values;
    }
  };
  const { mutate: verifyMutate, isPending: verifyIsPending } = useMutation({
    mutationFn: onVerify,
    onSuccess: (values: AuthSession | z.infer<typeof VerificationSchema>) => {
      if (type === "VERIFICATION") {
        const session = values as AuthSession;
        // setSession(session);
          setSession({
          ...session,
          token: "",
        });
        toast.success("Success!", {
          id: onVerifyToast,
          description: "Logged in successfully!",
        });
        if (callbackUrl) {
          router.replace(callbackUrl);
        } else {
          router.push("/dashboard");
        }
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
          ((error as AxiosError)?.response?.data as string) ||
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
