import Image from "next/image";
import { Metadata } from "next";
import { background } from "@assets";
import { APP_DESCRIPTION, APP_NAME } from "@data";
import { ResetPasswordForm } from "./components";

export const metadata: Metadata = {
  title: `${APP_NAME} | Reset Password`,
  description: APP_DESCRIPTION,
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    email: string;
    otp: string;
  }>;
};

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const { email, otp } = await searchParams;

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      {/* Background Image */}
      <Image
        src={background}
        alt="Background"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border-t-4 border-blue-500 bg-white p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-800">
              Create New Password
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Secure your {APP_NAME} account with a fresh password.
            </p>
          </div>

          <ResetPasswordForm email={email} otp={otp} />

        </div>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
