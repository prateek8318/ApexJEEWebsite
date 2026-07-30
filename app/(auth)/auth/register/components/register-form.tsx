"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import axios from "@config/axios";
import type { AxiosError } from "axios";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { PhoneInput } from "@components/ui/phone-input";
import { Checkbox } from "@components/ui/checkbox";
import { toast } from "@components/ui/toaster";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { encrypt } from "@lib/encrypt";
import { userAuthApi } from "@lib/api/user/auth";
import { RegisterSchema } from "@schemas/register";
import usePasswordToggle from "@hooks/usePasswordToggle";

type RegisterFormValues = z.infer<typeof RegisterSchema>;
const RegisterForm = () => {
  const router = useRouter();
  const [registerToastId, setRegisterToastId] = useState<string | number>();
  const { inputIcon: pwdIcon, inputType: pwdType } = usePasswordToggle();
  const { inputIcon: confirmPwdIcon, inputType: confirmPwdType } =
    usePasswordToggle();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      termsAccepted: false,
    },
  });

  const onRegister = async (values: RegisterFormValues) => {
    const toastId = toast.loading("Registering...", {
      description: "Creating your account...",
    });
    setRegisterToastId(toastId);

    // Call the new user auth api which expects: name, email, phone, password
    const response = await userAuthApi.signUp({
      name: values.fullName,
      email: values.email,
      phone: values.mobileNumber,
      password: values.password, // Backend might hash it or we send plain, schema shows no encrypt yet
    });
    
    return { response, email: values.email };
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onRegister,
    onSuccess: (data: any) => {
      toast.success("Success!", {
        id: registerToastId,
        description: data?.response?.message || "Account created successfully.",
      });
      router.push(`/auth/verify?email=${encodeURIComponent(data?.email || "")}&type=VERIFICATION`);
    },
    onError: (error: unknown) => {
      toast.error("Registration failed", {
        id: registerToastId,
        description:
          ((error as AxiosError)?.response?.data as string) ||
          "Internal server error!",
      });
    },
  });

  const inputCls =
    "h-10 rounded-lg border border-gray-200 bg-white text-[13px] text-gray-900 placeholder:text-gray-400 focus-visible:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit((values) => mutate(values))}
        className="flex flex-col gap-[14px]"
      >
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[12.5px] font-medium text-gray-700">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your name"
                    disabled={isPending}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[12.5px] font-medium text-gray-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={isPending}
                    className={inputCls}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[12.5px] font-medium text-gray-700">
                Mobile Number
              </FormLabel>
              <FormControl>
                <PhoneInput
                  placeholder="Enter  mobile number"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[12.5px] font-medium text-gray-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={pwdType}
                      placeholder="Enter password"
                      disabled={isPending}
                      className={`${inputCls} pr-9`}
                      {...field}
                    />
                    {pwdIcon}
                  </div>
                </FormControl>
                <p className="text-[11px] text-gray-400">
                  Enter a secure password
                </p>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className="text-[12.5px] font-medium text-gray-700">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={confirmPwdType}
                      placeholder="Enter confirm password "
                      disabled={isPending}
                      className={`${inputCls} pr-9`}
                      {...field}
                    />
                    {confirmPwdIcon}
                  </div>
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-[12.5px] font-medium text-gray-500">
                Referral/Coupon Code{" "}
                <span className="font-normal text-gray-400">(Optional)</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ASPIRE100"
                  disabled={isPending}
                  className={inputCls}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-2.5 space-y-0">
              <FormControl>
                <Checkbox
                  id="terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                  className="mt-[3px] h-[14px] w-[14px] shrink-0 rounded-[3px] border-gray-300"
                />
              </FormControl>
              <div className="flex-1">
                <FormLabel
                  htmlFor="terms"
                  className="cursor-pointer text-[12px] font-normal leading-[1.65] text-gray-500"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-gray-800 underline underline-offset-2 hover:text-gray-600"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-gray-800 underline underline-offset-2 hover:text-gray-600"
                  >
                    Privacy Policy
                  </Link>
                  . I understand that AspirantPro will process my data for my
                  study experience.
                </FormLabel>
                <FormMessage className="mt-1 text-[10px]" />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending}
          className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-[13.5px] font-medium tracking-wide text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        >
          {isPending ? (
            "Registering..."
          ) : (
            <>
              Register &amp; Verify OTP
              <ArrowRight size={15} strokeWidth={2} />
            </>
          )}
        </Button>
        <p className="text-center text-[12.5px] text-gray-500">
          Already registered?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-gray-900 underline-offset-2 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default RegisterForm;
