import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { VerifyForm } from "./components";
import { APP_DESCRIPTION, APP_NAME } from "@data";
import { background } from "@assets";

export const metadata: Metadata = {
  title: `${APP_NAME} | Verify`,
  description: APP_DESCRIPTION,
};

type VerifyPageProps = {
  searchParams: Promise<{
    email: string;
    type: string;
  }>;
};

const VerifyPage = async ({ searchParams }: VerifyPageProps) => {
  const { email, type } = await searchParams;


  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src={background}
        alt="Background"
        fill
        priority
        quality={100}
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
              <ShieldCheck size={24} className="text-indigo-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-800">Verify OTP</h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter the 6-digit code sent to your email.
            </p>
          </div>

          <VerifyForm email={email} type={type} />

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyPage;
