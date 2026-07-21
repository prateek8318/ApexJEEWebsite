import { ReactNode } from "react";
// import AuthPlacholder from "@components/common/auth-placholder";

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="flex h-screen overflow-hidden bg-primary-background">
      <div className="flex-1 flex items-center justify-center">{children}</div>
      {/* <AuthPlacholder /> */}
    </main>
  );
};

export default AuthLayout;
