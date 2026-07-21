import Image from "next/image";
import { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import { APP_DESCRIPTION, APP_NAME } from "@data";
import { background } from "@assets";
import RecoverPasswordForm from "./components/recover-password-form";

export const metadata: Metadata = {
  title: `${APP_NAME} | Recover Password`,
  description: APP_DESCRIPTION,
};

const RecoverPasswordPage = () => {
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/65 to-blue-950/70" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-5">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
              <ShieldCheck size={24} className="text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-800">
              Recover Password
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Enter your registered email or mobile to receive a verification
              code.
            </p>
          </div>

          {/* Form */}
          <RecoverPasswordForm />

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Secure 256-bit encrypted connection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecoverPasswordPage;
