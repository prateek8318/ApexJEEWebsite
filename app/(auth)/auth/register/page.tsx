import Image from "next/image";
import { Metadata } from "next";
import { RegisterForm } from "./components";
import { APP_DESCRIPTION, APP_NAME } from "@data";
import { CheckCircle2 } from "lucide-react";
import { background } from "@assets";

export const metadata: Metadata = {
  title: `${APP_NAME} | Register`,
  description: APP_DESCRIPTION,
};

const FEATURES = [
  "Personalized Daily Learning Paths",
  "Real-time Doubt Resolution",
  "Rank Predictor Analytics",
] as const;

const RegisterPage = () => {
  return (
    <section className="relative flex h-screen w-screen overflow-hidden">
      <Image
        src={background}
        alt=""
        fill
        priority
        quality={95}
        className="object-cover object-center"
        aria-hidden="true"
      />

      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/80" />
      <div className="relative z-10 flex h-full max-w-[1600px] mx-auto">
        <div className="hidden flex-1 flex-col justify-center px-14 lg:flex xl:px-20">
          <div className="max-w-[1360px] space-y-8">
            <div className="space-y-4">
              <h1 className="text-[3rem] font-bold leading-[1.2] text-white">
                Master the JEE with
                <br />
                Precision.
              </h1>
              <p className="text-[1.3rem] leading-[1.8] text-white/90">
                Access elite course materials, real-time mock tests, and
                AI-driven analytics designed for the top 1%. Your journey to IIT
                begins with focused deep work.
              </p>
            </div>
            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0 text-blue-400"
                  />
                  <span className="text-[1.1rem] text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex w-full items-center justify-center p-4 lg:w-[520px] lg:items-center lg:justify-center lg:p-10 xl:w-[560px]">
          <div className="w-full max-w-[440px] rounded-2xl bg-white shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
            <div
              className="overflow-y-auto px-9 py-9"
              style={{ maxHeight: "calc(100vh - 32px)" }}
            >
              {/* Card heading */}
              <div className="mb-7">
                <h2 className="text-[24px] font-semibold tracking-tight text-gray-900">
                  Create Account
                </h2>
                <p className="mt-1.5 text-[13px] text-gray-500">
                  Step into the elite circle of JEE aspirants.
                </p>
              </div>

              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
