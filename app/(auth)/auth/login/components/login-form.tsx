"use client";

import { z } from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@schemas/login";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import usePasswordToggle from "@hooks/usePasswordToggle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "@components/ui/toaster";
import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@lib/api/admin";
import { userAuthApi } from "@lib/api/user/auth";
import useSession from "@stores/session";

type LoginFormProps = { userType?: "student" | "tutor" | "admin" };

const LoginForm = ({
  userType = "student",
}: LoginFormProps = {}) => {
  // _userType reserved for future role-specific customization
  const { inputIcon, inputType } = usePasswordToggle();
  const router = useRouter();
  const { setSession } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [onLoginToast, setOnLoginToast] = useState<string | number>();

  const defaultValues: z.infer<typeof LoginSchema> = {
    email: "",
    password: "",
  };

  const form = useForm<z.infer<typeof LoginSchema>>({
    defaultValues,
    mode: "onTouched",
    resolver: zodResolver(LoginSchema),
  });

  const onLogin = async (values: z.infer<typeof LoginSchema>) => {
    setOnLoginToast(
      toast.loading("Loading...", { description: "Logging in..." }),
    );
    const { email, password } = values;

    if (userType === "admin") {
      const response = await authApi.login({ email, password });
      return response;
    } else {
      // Hit the new student login endpoint
      const response = await userAuthApi.login({ identifier: email, password });
      return { response, values };
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onLogin,
    onSuccess: (response: any) => {
      toast.dismiss(onLoginToast);
      
      if (userType === "admin") {
        const userObj = response?.data?.user || response?.user || { name: "Admin" };
        setSession({
          ...userObj,
          token: response?.token || "",
        });
        toast.success("Login successful!");
        router.replace("/admin/revenue"); // Redirect to admin revenue
      } else {
        const backendPayload = (response as any)?.response;
        const values = (response as any)?.values || response;
        
        const userObj = backendPayload?.data?.user || backendPayload?.user || { name: values?.email || "Student" };
        
        // set session and redirect to dashboard
        setSession({
          ...userObj,
          avatarUrl: userObj.profileImage || userObj.avatarUrl || null,
          token: backendPayload?.token || "",
        });
        toast.success("Login successful!");
        
        if (callbackUrl) {
          router.replace(callbackUrl);
        } else {
          router.replace("/dashboard");
        }
      }
    },
    onError: (error: unknown) => {
      toast.error("Error!", {
        id: onLoginToast,
        description:
          (typeof (error as AxiosError)?.response?.data === "string"
            ? (error as AxiosError).response?.data
            : ((error as AxiosError)?.response?.data as any)?.message) ||
          "Internal server error!",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex w-full max-w-sm flex-col gap-4"
        onSubmit={form.handleSubmit((values) => mutate(values))}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type={inputType}
                  placeholder="Enter your password"
                  startContent={<LockKeyhole size={16} />}
                  endContent={inputIcon}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Link
          href="/auth/recover-password"
          className="text-primary text-right text-xs font-medium md:text-sm"
        >
          Forgot Password?
        </Link>

        <div className="flex flex-col items-center gap-6">
          <Button
            type="submit"
            size="lg"
            className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 text-[13.5px] font-medium tracking-wide text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
            disabled={isPending}
          >
            Login
            <LogIn size={16} />
          </Button>

          <span className="text-xs md:text-sm">
            Don't have an account?{" "}
            <Link
              href={userType === "admin" ? "/auth/admin-register" : "/auth/register"}
              className="font-semibold text-gray-900 underline-offset-2 hover:underline"
            >
              Register now
            </Link>
          </span>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Back to Homepage
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
