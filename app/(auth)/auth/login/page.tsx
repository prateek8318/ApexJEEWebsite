import Image from "next/image";
import { Metadata } from "next";
import { LoginForm } from "./components";
import { APP_DESCRIPTION, APP_NAME } from "@data";
import { CheckCircle2 } from "lucide-react";
import { background } from "@assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";

export const metadata: Metadata = {
  title: `${APP_NAME} | Login`,
  description: APP_DESCRIPTION,
};

const FEATURES = [
  "Personalized Daily Learning Paths",
  "Real-time Doubt Resolution",
  "Rank Predictor Analytics",
] as const;

const LoginPage = () => {
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
      <div className="relative z-10 flex h-full max-w-400 mx-auto">
        <div className="hidden flex-1 flex-col justify-center px-14 lg:flex xl:px-20">
          <div className="max-w-340 space-y-8">
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
                  <span className="text-[1.1rem] text-slate-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex w-full items-center justify-center p-4 lg:w-130 lg:items-center lg:justify-center lg:p-10 xl:w-140">
          <div className="w-full max-w-110 rounded-2xl bg-white shadow-[0_16px_64px_rgba(0,0,0,0.5)]">
            <div
              className="overflow-y-auto px-9 py-9"
              style={{ maxHeight: "calc(100vh - 32px)" }}
            >
              {/* Tabs */}
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  {/* <TabsTrigger value="tutor">Tutor</TabsTrigger> */}
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>

                {/* Student Tab */}
                <TabsContent value="student" className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-[24px] font-semibold tracking-tight text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="mt-1.5 text-[13px] text-gray-500">
                      Log in to your scholar portal to continue your
                      preparation.
                    </p>
                  </div>
                  <LoginForm userType="student" />
                </TabsContent>

                {/* Tutor Tab */}
                {/* 
                <TabsContent value="tutor" className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-[24px] font-semibold tracking-tight text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="mt-1.5 text-[13px] text-gray-500">
                      Log in to your tutor portal to manage your classes.
                    </p>
                  </div>
                  <LoginForm userType="tutor" />
                </TabsContent>
                */}

                {/* Admin Tab */}
                <TabsContent value="admin" className="space-y-6">
                  <div className="mb-6">
                    <h2 className="text-[24px] font-semibold tracking-tight text-gray-900">
                      Welcome Back
                    </h2>
                    <p className="mt-1.5 text-[13px] text-gray-500">
                      Log in to your admin portal to manage the platform.
                    </p>
                  </div>
                  <LoginForm userType="admin" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
